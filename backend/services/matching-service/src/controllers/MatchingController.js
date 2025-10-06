const SkillMatchingEngine = require('../services/SkillMatchingEngine');
const { User, Skill } = require('../../../shared/database');
const logger = require('../../../shared/logger');

/**
 * Matching Service Controller
 * Handles API requests for skill matching and teacher recommendations
 */
class MatchingController {
  constructor() {
    this.matchingEngine = new SkillMatchingEngine();
    this.initializeEngine();
  }

  async initializeEngine() {
    try {
      await this.matchingEngine.initialize();
      logger.info('Matching engine initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize matching engine:', error);
    }
  }

  /**
   * Find teachers for a specific skill
   * POST /api/matching/find-teachers
   */
  async findTeachers(req, res) {
    try {
      const { skillId, preferences = {} } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!skillId) {
        return res.status(400).json({
          success: false,
          message: 'Skill ID is required'
        });
      }

      // Find matching teachers
      const matches = await this.matchingEngine.findBestMatch(
        userId,
        skillId,
        preferences
      );

      // Format response
      const formattedMatches = matches.map(match => ({
        teacherId: match.teacher._id,
        teacherInfo: {
          name: match.teacher.personal.name,
          avatar: match.teacher.personal.avatar,
          languages: match.teacher.personal.languages,
          timezone: match.teacher.personal.timezone,
          location: match.teacher.personal.location,
          bio: match.teacher.personal.bio
        },
        skillInfo: {
          level: match.teacher.skills.teaching.find(s => 
            s.skillId.toString() === skillId
          )?.level,
          hoursTaught: match.teacher.skills.teaching.find(s => 
            s.skillId.toString() === skillId
          )?.hoursTaught,
          rating: match.teacher.skills.teaching.find(s => 
            s.skillId.toString() === skillId
          )?.rating,
          totalReviews: match.teacher.skills.teaching.find(s => 
            s.skillId.toString() === skillId
          )?.totalReviews,
          pricing: match.teacher.skills.teaching.find(s => 
            s.skillId.toString() === skillId
          )?.pricing
        },
        matchScore: match.score,
        compatibility: match.breakdown,
        availability: match.teacher.skills.teaching.find(s => 
          s.skillId.toString() === skillId
        )?.availability
      }));

      res.json({
        success: true,
        data: {
          matches: formattedMatches,
          totalCount: formattedMatches.length,
          searchCriteria: {
            skillId,
            preferences,
            timestamp: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      logger.error('Error in findTeachers:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get skill recommendations based on user profile
   * GET /api/matching/skill-recommendations
   */
  async getSkillRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10, category } = req.query;

      const user = await User.findById(userId).populate('skills.learning skills.teaching');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Get skill recommendations based on user's current skills and interests
      const recommendations = await this.getPersonalizedSkillRecommendations(
        user,
        parseInt(limit),
        category
      );

      res.json({
        success: true,
        data: {
          recommendations,
          totalCount: recommendations.length,
          userProfile: {
            currentSkills: user.skills.learning.length + user.skills.teaching.length,
            experienceLevel: this.calculateUserExperienceLevel(user),
            primaryCategories: this.getUserPrimaryCategories(user)
          }
        }
      });

    } catch (error) {
      logger.error('Error in getSkillRecommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get teacher compatibility score for a specific teacher-learner pair
   * POST /api/matching/compatibility-score
   */
  async getCompatibilityScore(req, res) {
    try {
      const { teacherId, skillId } = req.body;
      const learnerId = req.user.id;

      if (!teacherId || !skillId) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID and Skill ID are required'
        });
      }

      const compatibility = await this.calculateDetailedCompatibility(
        learnerId,
        teacherId,
        skillId
      );

      res.json({
        success: true,
        data: compatibility
      });

    } catch (error) {
      logger.error('Error in getCompatibilityScore:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update matching algorithm weights (Admin only)
   * PUT /api/matching/algorithm-weights
   */
  async updateAlgorithmWeights(req, res) {
    try {
      const { weights } = req.body;

      // Validate weights sum to 1
      const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
      if (Math.abs(totalWeight - 1) > 0.01) {
        return res.status(400).json({
          success: false,
          message: 'Weights must sum to 1.0'
        });
      }

      // Update matching engine weights
      this.matchingEngine.weights = weights;

      // Log the change
      logger.info('Algorithm weights updated:', weights);

      res.json({
        success: true,
        message: 'Algorithm weights updated successfully',
        data: { weights }
      });

    } catch (error) {
      logger.error('Error in updateAlgorithmWeights:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get matching analytics and insights
   * GET /api/matching/analytics
   */
  async getMatchingAnalytics(req, res) {
    try {
      const { timeframe = '7d' } = req.query;
      
      const analytics = await this.generateMatchingAnalytics(timeframe);

      res.json({
        success: true,
        data: analytics
      });

    } catch (error) {
      logger.error('Error in getMatchingAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Batch matching for multiple skills
   * POST /api/matching/batch-match
   */
  async batchMatch(req, res) {
    try {
      const { skillIds, preferences = {} } = req.body;
      const userId = req.user.id;

      if (!Array.isArray(skillIds) || skillIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Skills array is required'
        });
      }

      if (skillIds.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 skills allowed per batch request'
        });
      }

      // Process matches in parallel
      const batchResults = await Promise.all(
        skillIds.map(async (skillId) => {
          try {
            const matches = await this.matchingEngine.findBestMatch(
              userId,
              skillId,
              preferences
            );
            return {
              skillId,
              success: true,
              matches: matches.slice(0, 5), // Top 5 for each skill
              count: matches.length
            };
          } catch (error) {
            return {
              skillId,
              success: false,
              error: error.message,
              matches: [],
              count: 0
            };
          }
        })
      );

      res.json({
        success: true,
        data: {
          results: batchResults,
          summary: {
            totalSkills: skillIds.length,
            successfulMatches: batchResults.filter(r => r.success).length,
            failedMatches: batchResults.filter(r => !r.success).length
          }
        }
      });

    } catch (error) {
      logger.error('Error in batchMatch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Helper method to get personalized skill recommendations
   */
  async getPersonalizedSkillRecommendations(user, limit, category) {
    // Build query based on user's current skills and interests
    const query = { status: 'active' };
    
    if (category) {
      query.category = category;
    }

    // Get all skills
    let skills = await Skill.find(query)
      .populate('relatedSkills.skillId')
      .sort({ 'trendingScore.score': -1 });

    // Filter out skills user already has
    const userSkillIds = new Set([
      ...user.skills.teaching.map(s => s.skillId.toString()),
      ...user.skills.learning.map(s => s.skillId.toString())
    ]);

    skills = skills.filter(skill => !userSkillIds.has(skill._id.toString()));

    // Score skills based on user's profile
    const scoredSkills = skills.map(skill => {
      let score = 0;

      // Base popularity score (30%)
      score += (skill.trendingScore.score / 100) * 0.3;

      // Industry demand score (25%)
      score += (skill.industryDemand.score / 100) * 0.25;

      // Skill relationship score (25%)
      const relationshipScore = this.calculateSkillRelationshipRecommendationScore(
        user, skill
      );
      score += relationshipScore * 0.25;

      // Difficulty compatibility (20%)
      const difficultyScore = this.calculateDifficultyCompatibility(user, skill);
      score += difficultyScore * 0.2;

      return {
        skill,
        score,
        reasons: this.generateRecommendationReasons(user, skill)
      };
    });

    // Sort by score and return top results
    return scoredSkills
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => ({
        skillId: item.skill._id,
        name: item.skill.name,
        description: item.skill.description,
        category: item.skill.category,
        subcategory: item.skill.subcategory,
        difficultyLevel: item.skill.difficultyLevel,
        averageLearningHours: item.skill.averageLearningHours,
        recommendationScore: Math.round(item.score * 100),
        reasons: item.reasons,
        trendingScore: item.skill.trendingScore.score,
        industryDemand: item.skill.industryDemand.score,
        statistics: {
          totalTeachers: item.skill.statistics.totalTeachers,
          averageRating: item.skill.statistics.averageTeacherRating
        }
      }));
  }

  /**
   * Calculate detailed compatibility between learner and teacher
   */
  async calculateDetailedCompatibility(learnerId, teacherId, skillId) {
    const [learner, teacher, skill] = await Promise.all([
      User.findById(learnerId).populate('skills.learning skills.teaching'),
      User.findById(teacherId).populate('skills.teaching'),
      Skill.findById(skillId)
    ]);

    if (!learner || !teacher || !skill) {
      throw new Error('Learner, teacher, or skill not found');
    }

    const teacherSkill = teacher.skills.teaching.find(
      s => s.skillId.toString() === skillId
    );

    if (!teacherSkill) {
      throw new Error('Teacher does not teach this skill');
    }

    const learnerProfile = await this.matchingEngine.buildLearnerProfile(learner);
    
    // Calculate individual compatibility scores
    const scores = {
      skillLevel: this.matchingEngine.calculateLevelCompatibility(
        learnerProfile.skillInterests.find(s => s.skillId.toString() === skillId),
        teacherSkill
      ),
      experience: Math.min(teacherSkill.hoursTaught / 100, 1),
      rating: teacherSkill.rating / 5,
      communication: await this.calculateCommunicationCompatibility(learner, teacher),
      schedule: this.calculateScheduleCompatibility(learner, teacher, teacherSkill),
      pricing: this.calculatePricingCompatibility(learner, teacherSkill)
    };

    // Overall compatibility
    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    return {
      teacherId: teacher._id,
      skillId: skill._id,
      overallCompatibility: Math.round(overallScore * 100),
      detailedScores: {
        skillLevelMatch: Math.round(scores.skillLevel * 100),
        experienceLevel: Math.round(scores.experience * 100),
        teacherRating: Math.round(scores.rating * 100),
        communicationStyle: Math.round(scores.communication * 100),
        scheduleAlignment: Math.round(scores.schedule * 100),
        pricingFit: Math.round(scores.pricing * 100)
      },
      recommendations: this.generateCompatibilityRecommendations(scores),
      estimatedSuccessRate: Math.round(overallScore * 85 + 15) // 15-100% range
    };
  }

  /**
   * Generate matching analytics
   */
  async generateMatchingAnalytics(timeframe) {
    // This would generate comprehensive analytics
    // Simplified version for now
    return {
      totalMatches: 1250,
      successfulSessions: 1050,
      averageMatchScore: 0.78,
      topSkillCategories: [
        { category: 'Programming', matches: 450 },
        { category: 'Design', matches: 320 },
        { category: 'Marketing', matches: 280 }
      ],
      algorithmPerformance: {
        contentBased: 0.72,
        collaborative: 0.68,
        availability: 0.85,
        realTime: 0.75
      },
      userSatisfaction: {
        averageRating: 4.3,
        recommendationAccuracy: 0.76
      }
    };
  }

  // Additional helper methods...
  calculateUserExperienceLevel(user) {
    if (!user.skills.teaching || user.skills.teaching.length === 0) return 0;
    return user.skills.teaching.reduce((sum, skill) => sum + skill.level, 0) / user.skills.teaching.length;
  }

  getUserPrimaryCategories(user) {
    const categories = new Set();
    user.skills.teaching.forEach(skill => {
      if (skill.skillId.category) categories.add(skill.skillId.category);
    });
    user.skills.learning.forEach(skill => {
      if (skill.skillId.category) categories.add(skill.skillId.category);
    });
    return Array.from(categories);
  }

  calculateSkillRelationshipRecommendationScore(user, skill) {
    // Implementation for calculating how well a skill relates to user's existing skills
    return 0.5;
  }

  calculateDifficultyCompatibility(user, skill) {
    // Implementation for calculating if skill difficulty matches user's level
    const userLevel = this.calculateUserExperienceLevel(user);
    const optimalDifficulty = userLevel + 2; // Slightly challenging
    const difference = Math.abs(skill.difficultyLevel - optimalDifficulty);
    return Math.max(0, 1 - difference / 5);
  }

  generateRecommendationReasons(user, skill) {
    return [
      "Popular in your field",
      "Complements your existing skills",
      "High industry demand"
    ];
  }

  async calculateCommunicationCompatibility(learner, teacher) {
    // Check language overlap, communication style, etc.
    const commonLanguages = learner.personal.languages.filter(lang =>
      teacher.personal.languages.includes(lang)
    );
    return commonLanguages.length > 0 ? 0.8 : 0.3;
  }

  calculateScheduleCompatibility(learner, teacher, teacherSkill) {
    // Simplified schedule compatibility
    return 0.7;
  }

  calculatePricingCompatibility(learner, teacherSkill) {
    // This would check if pricing fits learner's budget
    // Simplified for now
    return 0.8;
  }

  generateCompatibilityRecommendations(scores) {
    const recommendations = [];
    
    if (scores.skillLevel < 0.6) {
      recommendations.push("Consider foundational courses first");
    }
    if (scores.schedule < 0.5) {
      recommendations.push("Discuss flexible scheduling options");
    }
    if (scores.communication < 0.7) {
      recommendations.push("Ensure language compatibility before booking");
    }
    
    return recommendations;
  }
}

module.exports = MatchingController;