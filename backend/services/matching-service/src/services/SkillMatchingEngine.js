const tf = require('@tensorflow/tfjs-node');
const { User, Skill, Session, Review } = require('../../shared/database');
const logger = require('../../shared/logger');
const Redis = require('redis');

/**
 * AI-Powered Skill Matching Engine
 * Combines collaborative filtering, content-based filtering, and real-time factors
 */
class SkillMatchingEngine {
  constructor() {
    this.redis = Redis.createClient(process.env.REDIS_URL);
    this.model = null;
    this.weights = {
      contentBased: 0.4,
      collaborative: 0.3,
      availability: 0.15,
      realTime: 0.15
    };
  }

  /**
   * Initialize the matching engine with pre-trained ML model
   */
  async initialize() {
    try {
      // Load pre-trained TensorFlow model for matching
      this.model = await tf.loadLayersModel('file://./models/matching-model.json');
      logger.info('AI Matching model loaded successfully');
    } catch (error) {
      logger.warn('ML model not found, using traditional algorithms');
      this.model = null;
    }
  }

  /**
   * Find the best teachers for a specific skill request
   * @param {string} userId - ID of the learner
   * @param {string} requiredSkillId - ID of the skill to learn
   * @param {Object} preferences - User preferences for matching
   * @returns {Array} Ranked list of potential teachers
   */
  async findBestMatch(userId, requiredSkillId, preferences = {}) {
    try {
      const startTime = Date.now();
      
      // Get user and skill data
      const [user, skill] = await Promise.all([
        User.findById(userId).populate('skills.learning skills.teaching'),
        Skill.findById(requiredSkillId)
      ]);

      if (!user || !skill) {
        throw new Error('User or skill not found');
      }

      // 1. Build learner profile for content-based filtering
      const learnerProfile = await this.buildLearnerProfile(user);
      
      // 2. Find potential teachers for this skill
      const potentialTeachers = await this.findPotentialTeachers(requiredSkillId, preferences);
      
      if (potentialTeachers.length === 0) {
        return [];
      }

      // 3. Apply different filtering algorithms
      const [
        contentScores,
        collaborativeScores,
        availabilityScores,
        realTimeScores
      ] = await Promise.all([
        this.contentBasedFiltering(learnerProfile, potentialTeachers, skill),
        this.collaborativeFiltering(user, potentialTeachers, skill),
        this.availabilityMatching(potentialTeachers, preferences),
        this.realTimeFactors(potentialTeachers)
      ]);

      // 4. Combine scores using weighted algorithm
      const finalScores = this.combineScores(
        contentScores,
        collaborativeScores,
        availabilityScores,
        realTimeScores
      );

      // 5. Apply ML model if available
      const mlEnhancedScores = this.model ? 
        await this.applyMLModel(learnerProfile, potentialTeachers, finalScores) :
        finalScores;

      // 6. Rank and return results
      const rankedTeachers = this.rankTeachers(potentialTeachers, mlEnhancedScores);
      
      // Cache results for performance
      await this.cacheResults(userId, requiredSkillId, rankedTeachers);
      
      const duration = Date.now() - startTime;
      logger.info(`Matching completed in ${duration}ms for user ${userId}`);
      
      return rankedTeachers;

    } catch (error) {
      logger.error('Error in findBestMatch:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive learner profile for content-based filtering
   */
  async buildLearnerProfile(user) {
    const profile = {
      userId: user._id,
      skillInterests: [],
      learningStyle: null,
      experienceLevel: 0,
      previousSessions: [],
      preferences: {},
      skillVector: []
    };

    // Extract learning skills and preferences
    if (user.skills.learning) {
      profile.skillInterests = user.skills.learning.map(skill => ({
        skillId: skill.skillId,
        currentLevel: skill.currentLevel,
        targetLevel: skill.targetLevel,
        hoursLearned: skill.hoursLearned,
        preferredLearningStyle: skill.preferredLearningStyle
      }));

      // Determine primary learning style
      const styles = user.skills.learning
        .map(s => s.preferredLearningStyle)
        .filter(Boolean);
      profile.learningStyle = this.getMostFrequent(styles) || 'visual';
    }

    // Calculate average experience level
    if (user.skills.teaching && user.skills.teaching.length > 0) {
      profile.experienceLevel = user.skills.teaching.reduce((sum, skill) => 
        sum + skill.level, 0) / user.skills.teaching.length;
    }

    // Get session history for collaborative filtering
    profile.previousSessions = await Session.find({
      'participants.learner': user._id,
      status: 'completed'
    }).populate('skill participants.teacher');

    // Build skill vector for similarity calculations
    profile.skillVector = await this.buildSkillVector(user);

    return profile;
  }

  /**
   * Content-based filtering algorithm
   */
  async contentBasedFiltering(learnerProfile, teachers, targetSkill) {
    const scores = {};

    for (const teacher of teachers) {
      let score = 0;
      const teacherSkill = teacher.skills.teaching.find(
        s => s.skillId.toString() === targetSkill._id.toString()
      );

      if (!teacherSkill) continue;

      // 1. Skill level compatibility (40% weight)
      const levelMatch = this.calculateLevelCompatibility(
        learnerProfile.skillInterests.find(s => s.skillId.toString() === targetSkill._id.toString()),
        teacherSkill
      );
      score += levelMatch * 0.4;

      // 2. Teaching experience (25% weight)
      const experienceScore = Math.min(teacherSkill.hoursTaught / 100, 1);
      score += experienceScore * 0.25;

      // 3. Teacher rating (20% weight)
      const ratingScore = teacherSkill.rating / 5;
      score += ratingScore * 0.2;

      // 4. Skill relationship compatibility (15% weight)
      const relationshipScore = await this.calculateSkillRelationshipScore(
        learnerProfile, teacher, targetSkill
      );
      score += relationshipScore * 0.15;

      scores[teacher._id] = Math.min(score, 1);
    }

    return scores;
  }

  /**
   * Collaborative filtering using user-based recommendations
   */
  async collaborativeFiltering(learner, teachers, targetSkill) {
    const scores = {};

    // Find users similar to the learner
    const similarUsers = await this.findSimilarLearners(learner, 20);
    
    if (similarUsers.length === 0) {
      // Return neutral scores if no similar users found
      teachers.forEach(teacher => {
        scores[teacher._id] = 0.5;
      });
      return scores;
    }

    // Get sessions of similar users for this skill
    const similarUserSessions = await Session.find({
      'participants.learner': { $in: similarUsers.map(u => u._id) },
      skill: targetSkill._id,
      status: 'completed'
    }).populate('participants.teacher feedback');

    for (const teacher of teachers) {
      // Find sessions where similar users learned from this teacher
      const teacherSessions = similarUserSessions.filter(
        session => session.participants.teacher._id.toString() === teacher._id.toString()
      );

      if (teacherSessions.length === 0) {
        scores[teacher._id] = 0.3; // Neutral score for new teachers
        continue;
      }

      // Calculate average satisfaction from similar users
      const ratings = teacherSessions
        .map(session => session.feedback?.fromLearner?.rating)
        .filter(rating => rating !== undefined);

      if (ratings.length === 0) {
        scores[teacher._id] = 0.4;
        continue;
      }

      const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      const normalizedScore = (avgRating - 1) / 4; // Normalize 1-5 to 0-1

      // Apply confidence factor based on number of reviews
      const confidence = Math.min(ratings.length / 5, 1);
      scores[teacher._id] = normalizedScore * confidence + 0.3 * (1 - confidence);
    }

    return scores;
  }

  /**
   * Availability matching algorithm
   */
  async availabilityMatching(teachers, preferences) {
    const scores = {};
    const currentTime = new Date();

    for (const teacher of teachers) {
      let score = 0;

      // Check each teaching skill for availability
      for (const teachingSkill of teacher.skills.teaching) {
        if (!teachingSkill.availability) continue;

        // 1. Hours per week availability (40% weight)
        const hoursScore = Math.min(teachingSkill.availability.hoursPerWeek / 20, 1);
        score += hoursScore * 0.4;

        // 2. Time slot compatibility (60% weight)
        if (preferences.preferredTimeSlots && teachingSkill.availability.preferredTimeSlots) {
          const timeSlotMatch = this.calculateTimeSlotCompatibility(
            preferences.preferredTimeSlots,
            teachingSkill.availability.preferredTimeSlots,
            preferences.timezone || 'UTC',
            teacher.personal.timezone
          );
          score += timeSlotMatch * 0.6;
        } else {
          score += 0.5 * 0.6; // Neutral score if no preference specified
        }
      }

      // Average across all teaching skills
      score = teacher.skills.teaching.length > 0 ? 
        score / teacher.skills.teaching.length : 0;

      scores[teacher._id] = Math.min(score, 1);
    }

    return scores;
  }

  /**
   * Real-time factors affecting matching
   */
  async realTimeFactors(teachers) {
    const scores = {};
    const currentTime = new Date();

    for (const teacher of teachers) {
      let score = 0.5; // Base score

      // 1. Recent activity boost (25% weight)
      const daysSinceLastActive = (currentTime - teacher.lastActiveAt) / (1000 * 60 * 60 * 24);
      const activityScore = Math.max(0, 1 - daysSinceLastActive / 7); // Decay over a week
      score += activityScore * 0.25;

      // 2. Response time factor (25% weight)
      const avgResponseTime = await this.getAverageResponseTime(teacher._id);
      const responseScore = Math.max(0, 1 - avgResponseTime / 24); // Hours to response
      score += responseScore * 0.25;

      // 3. Current workload (25% weight)
      const currentSessions = await this.getCurrentSessionLoad(teacher._id);
      const workloadScore = Math.max(0, 1 - currentSessions / 10); // Max 10 concurrent sessions
      score += workloadScore * 0.25;

      // 4. Trending skill bonus (25% weight)
      const trendingBonus = await this.getTrendingSkillBonus(teacher);
      score += trendingBonus * 0.25;

      scores[teacher._id] = Math.min(score, 1);
    }

    return scores;
  }

  /**
   * Apply machine learning model for enhanced scoring
   */
  async applyMLModel(learnerProfile, teachers, currentScores) {
    if (!this.model) return currentScores;

    try {
      const enhancedScores = { ...currentScores };

      for (const teacher of teachers) {
        // Extract features for ML model
        const features = this.extractMLFeatures(learnerProfile, teacher, currentScores[teacher._id]);
        
        // Create tensor and predict
        const featureTensor = tf.tensor2d([features]);
        const prediction = this.model.predict(featureTensor);
        const predictionData = await prediction.data();
        
        // Combine ML prediction with existing score
        const mlScore = predictionData[0];
        const combinedScore = currentScores[teacher._id] * 0.7 + mlScore * 0.3;
        
        enhancedScores[teacher._id] = Math.min(combinedScore, 1);
        
        // Clean up tensors
        featureTensor.dispose();
        prediction.dispose();
      }

      return enhancedScores;
    } catch (error) {
      logger.error('Error applying ML model:', error);
      return currentScores;
    }
  }

  /**
   * Combine all scoring algorithms using weighted approach
   */
  combineScores(contentScores, collaborativeScores, availabilityScores, realTimeScores) {
    const combinedScores = {};
    const allTeacherIds = new Set([
      ...Object.keys(contentScores),
      ...Object.keys(collaborativeScores),
      ...Object.keys(availabilityScores),
      ...Object.keys(realTimeScores)
    ]);

    for (const teacherId of allTeacherIds) {
      const content = contentScores[teacherId] || 0;
      const collaborative = collaborativeScores[teacherId] || 0;
      const availability = availabilityScores[teacherId] || 0;
      const realTime = realTimeScores[teacherId] || 0;

      combinedScores[teacherId] = 
        content * this.weights.contentBased +
        collaborative * this.weights.collaborative +
        availability * this.weights.availability +
        realTime * this.weights.realTime;
    }

    return combinedScores;
  }

  /**
   * Rank teachers based on final scores
   */
  rankTeachers(teachers, scores) {
    return teachers
      .map(teacher => ({
        teacher: teacher,
        score: scores[teacher._id] || 0,
        breakdown: {
          overallCompatibility: Math.round(scores[teacher._id] * 100),
          experience: teacher.skills.teaching[0]?.hoursTaught || 0,
          rating: teacher.skills.teaching[0]?.rating || 0,
          responseTime: '< 2 hours', // This would be calculated
          availability: teacher.skills.teaching[0]?.availability?.hoursPerWeek || 0
        }
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Return top 20 matches
  }

  /**
   * Helper method to find potential teachers for a skill
   */
  async findPotentialTeachers(skillId, preferences = {}) {
    const query = {
      'skills.teaching.skillId': skillId,
      status: 'active'
    };

    // Apply filters if preferences are specified
    if (preferences.minRating) {
      query['skills.teaching.rating'] = { $gte: preferences.minRating };
    }

    if (preferences.maxPrice) {
      query['skills.teaching.pricing.hourlyRate'] = { $lte: preferences.maxPrice };
    }

    if (preferences.languages && preferences.languages.length > 0) {
      query['personal.languages'] = { $in: preferences.languages };
    }

    if (preferences.location && preferences.location.country) {
      query['personal.location.country'] = preferences.location.country;
    }

    return await User.find(query)
      .populate('skills.teaching.skillId')
      .limit(100); // Limit for performance
  }

  /**
   * Calculate skill vector for similarity computations
   */
  async buildSkillVector(user) {
    // This would create a vector representation of user's skills
    // for similarity calculations
    const allSkills = await Skill.find({}).select('_id');
    const vector = new Array(allSkills.length).fill(0);

    // Fill vector based on user's skills
    user.skills.teaching.forEach(skill => {
      const index = allSkills.findIndex(s => s._id.toString() === skill.skillId.toString());
      if (index !== -1) {
        vector[index] = skill.level / 10; // Normalize to 0-1
      }
    });

    user.skills.learning.forEach(skill => {
      const index = allSkills.findIndex(s => s._id.toString() === skill.skillId.toString());
      if (index !== -1) {
        vector[index] = Math.max(vector[index], skill.currentLevel / 10);
      }
    });

    return vector;
  }

  /**
   * Find similar learners using cosine similarity
   */
  async findSimilarLearners(user, limit = 10) {
    // Implement cosine similarity to find similar users
    // This is a simplified version - in production, you'd use more sophisticated algorithms
    const userVector = await this.buildSkillVector(user);
    
    const similarUsers = await User.find({
      _id: { $ne: user._id },
      'skills.learning': { $exists: true, $ne: [] }
    }).limit(50);

    const similarities = [];
    
    for (const otherUser of similarUsers) {
      const otherVector = await this.buildSkillVector(otherUser);
      const similarity = this.cosineSimilarity(userVector, otherVector);
      similarities.push({ user: otherUser, similarity });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.user);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vectorA, vectorB) {
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Calculate level compatibility between learner and teacher
   */
  calculateLevelCompatibility(learnerSkill, teacherSkill) {
    if (!learnerSkill) return 0.5; // Neutral if learner hasn't specified this skill

    const levelGap = teacherSkill.level - learnerSkill.currentLevel;
    
    // Optimal gap is 2-4 levels
    if (levelGap >= 2 && levelGap <= 4) return 1.0;
    if (levelGap >= 1 && levelGap <= 5) return 0.8;
    if (levelGap >= 0 && levelGap <= 6) return 0.6;
    return 0.3; // Too large or negative gap
  }

  /**
   * Calculate time slot compatibility between learner and teacher
   */
  calculateTimeSlotCompatibility(learnerSlots, teacherSlots, learnerTz, teacherTz) {
    // This would implement timezone conversion and overlap calculation
    // Simplified version for now
    const overlap = learnerSlots.filter(learnerSlot =>
      teacherSlots.some(teacherSlot => 
        learnerSlot.day === teacherSlot.day &&
        this.timeOverlap(learnerSlot, teacherSlot)
      )
    );
    
    return Math.min(overlap.length / learnerSlots.length, 1);
  }

  /**
   * Check if two time slots overlap
   */
  timeOverlap(slot1, slot2) {
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);
    
    return start1 < end2 && start2 < end1;
  }

  /**
   * Convert time string to minutes for comparison
   */
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Get most frequent item from array
   */
  getMostFrequent(arr) {
    const frequency = {};
    let maxCount = 0;
    let mostFrequent = null;
    
    arr.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxCount) {
        maxCount = frequency[item];
        mostFrequent = item;
      }
    });
    
    return mostFrequent;
  }

  /**
   * Cache matching results for performance
   */
  async cacheResults(userId, skillId, results) {
    const cacheKey = `match:${userId}:${skillId}`;
    await this.redis.setex(cacheKey, 300, JSON.stringify(results)); // Cache for 5 minutes
  }

  /**
   * Extract features for ML model
   */
  extractMLFeatures(learnerProfile, teacher, currentScore) {
    return [
      learnerProfile.experienceLevel,
      teacher.reputation.score / 100,
      teacher.skills.teaching[0]?.hoursTaught / 1000 || 0,
      teacher.skills.teaching[0]?.rating / 5 || 0,
      currentScore,
      teacher.personal.languages.length,
      learnerProfile.skillInterests.length
    ];
  }

  // Additional helper methods would be implemented here...
  async calculateSkillRelationshipScore(learnerProfile, teacher, targetSkill) {
    // Implementation for skill relationship scoring
    return 0.5;
  }

  async getAverageResponseTime(teacherId) {
    // Implementation for calculating average response time
    return 2; // hours
  }

  async getCurrentSessionLoad(teacherId) {
    // Implementation for getting current session load
    return 3;
  }

  async getTrendingSkillBonus(teacher) {
    // Implementation for trending skill bonus
    return 0.1;
  }
}

module.exports = SkillMatchingEngine;