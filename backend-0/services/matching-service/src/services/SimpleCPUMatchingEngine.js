const tf = require("@tensorflow/tfjs");

/**
 * Simplified AI-Powered Skill Matching Engine using TensorFlow.js CPU
 * Works without pre-trained models and Visual Studio build tools
 */
class SkillMatchingEngine {
  constructor() {
    this.initialized = false;
    this.weights = {
      contentBased: 0.4,
      collaborative: 0.3,
      availability: 0.15,
      realTime: 0.15,
    };

    // Simple neural network for basic matching
    this.model = null;
  }

  /**
   * Initialize the matching engine with a simple neural network
   */
  async initialize() {
    try {
      console.log("Initializing TensorFlow.js CPU-based matching engine...");

      // Create a simple neural network for teacher-student matching
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [10], // 10 features: skill match, availability, rating, etc.
            units: 16,
            activation: "relu",
          }),
          tf.layers.dense({
            units: 8,
            activation: "relu",
          }),
          tf.layers.dense({
            units: 1,
            activation: "sigmoid", // Output similarity score 0-1
          }),
        ],
      });

      // Compile the model
      this.model.compile({
        optimizer: "adam",
        loss: "binaryCrossentropy",
        metrics: ["accuracy"],
      });

      this.initialized = true;
      console.log(
        "✅ TensorFlow.js CPU matching engine initialized successfully!"
      );

      // Train with some dummy data to warm up the model
      await this.warmUpModel();
    } catch (error) {
      console.error(
        "❌ Failed to initialize TensorFlow matching engine:",
        error.message
      );
      // Fall back to rule-based matching
      this.initialized = false;
    }
  }

  /**
   * Warm up the model with dummy training data
   */
  async warmUpModel() {
    try {
      // Generate some dummy training data
      const numSamples = 100;
      const features = tf.randomNormal([numSamples, 10]);
      const labels = tf.randomUniform([numSamples, 1]);

      // Quick training to initialize weights
      await this.model.fit(features, labels, {
        epochs: 5,
        verbose: 0,
        batchSize: 32,
      });

      features.dispose();
      labels.dispose();

      console.log("✅ Model warmed up successfully");
    } catch (error) {
      console.warn(
        "⚠️ Model warm-up failed, using default weights:",
        error.message
      );
    }
  }

  /**
   * Find matching teachers for a student request
   */
  async findMatches(studentId, skillId, requirements = {}) {
    try {
      console.log(
        `🔍 Finding matches for student ${studentId}, skill ${skillId}`
      );

      // Mock data - in real implementation, this would come from database
      const availableTeachers = await this.getAvailableTeachers(skillId);
      const studentProfile = await this.getStudentProfile(studentId);

      if (!availableTeachers.length) {
        return {
          matches: [],
          message: "No teachers available for this skill at the moment",
        };
      }

      let matches;

      if (this.initialized && this.model) {
        // Use AI-based matching
        matches = await this.aiBasedMatching(
          studentProfile,
          availableTeachers,
          requirements
        );
      } else {
        // Fall back to rule-based matching
        matches = await this.ruleBasedMatching(
          studentProfile,
          availableTeachers,
          requirements
        );
      }

      // Sort by compatibility score
      matches.sort((a, b) => b.compatibility - a.compatibility);

      return {
        matches: matches.slice(0, 10), // Top 10 matches
        algorithm: this.initialized ? "ai-based" : "rule-based",
        totalCandidates: availableTeachers.length,
      };
    } catch (error) {
      console.error("❌ Error in findMatches:", error.message);
      throw new Error(`Matching failed: ${error.message}`);
    }
  }

  /**
   * AI-based matching using TensorFlow.js
   */
  async aiBasedMatching(student, teachers, requirements) {
    const matches = [];

    for (const teacher of teachers) {
      try {
        // Extract features for the neural network
        const features = this.extractFeatures(student, teacher, requirements);

        // Convert to tensor
        const inputTensor = tf.tensor2d([features], [1, 10]);

        // Get prediction
        const prediction = this.model.predict(inputTensor);
        const compatibilityScore = await prediction.data();

        // Clean up tensors
        inputTensor.dispose();
        prediction.dispose();

        // Add additional scoring factors
        const finalScore = this.calculateFinalScore(
          compatibilityScore[0],
          student,
          teacher,
          requirements
        );

        matches.push({
          teacherId: teacher.id,
          teacherName: teacher.name,
          compatibility: Math.round(finalScore * 100) / 100,
          aiScore: Math.round(compatibilityScore[0] * 100) / 100,
          reasons: this.generateMatchReasons(student, teacher, finalScore),
          availability: teacher.availability,
          hourlyRate: teacher.hourlyRate,
          rating: teacher.rating,
          experience: teacher.experience,
        });
      } catch (error) {
        console.warn(
          `⚠️ AI matching failed for teacher ${teacher.id}, using fallback:`,
          error.message
        );

        // Fallback to rule-based for this teacher
        const ruleScore = this.calculateRuleBasedScore(
          student,
          teacher,
          requirements
        );
        matches.push({
          teacherId: teacher.id,
          teacherName: teacher.name,
          compatibility: ruleScore,
          aiScore: null,
          reasons: this.generateMatchReasons(student, teacher, ruleScore),
          availability: teacher.availability,
          hourlyRate: teacher.hourlyRate,
          rating: teacher.rating,
          experience: teacher.experience,
        });
      }
    }

    return matches;
  }

  /**
   * Extract numerical features for the neural network
   */
  extractFeatures(student, teacher, requirements) {
    return [
      teacher.rating / 5.0, // Normalized rating (0-1)
      teacher.experience / 10.0, // Normalized experience (0-1, capped at 10 years)
      teacher.totalSessions / 1000.0, // Normalized session count (0-1, capped at 1000)
      student.currentLevel === teacher.preferredLevel ? 1.0 : 0.0, // Level match
      teacher.availability.includes(requirements.preferredTime || "morning")
        ? 1.0
        : 0.0, // Time match
      Math.min(teacher.hourlyRate / (requirements.maxBudget || 10000), 1.0), // Budget compatibility
      teacher.responseTime / 60.0, // Normalized response time (0-1, in hours)
      teacher.completionRate, // Already 0-1
      teacher.isVerified ? 1.0 : 0.0, // Verification status
      Math.random() * 0.1, // Small randomization factor
    ];
  }

  /**
   * Rule-based matching fallback
   */
  async ruleBasedMatching(student, teachers, requirements) {
    const matches = [];

    for (const teacher of teachers) {
      const score = this.calculateRuleBasedScore(
        student,
        teacher,
        requirements
      );

      matches.push({
        teacherId: teacher.id,
        teacherName: teacher.name,
        compatibility: score,
        aiScore: null,
        reasons: this.generateMatchReasons(student, teacher, score),
        availability: teacher.availability,
        hourlyRate: teacher.hourlyRate,
        rating: teacher.rating,
        experience: teacher.experience,
      });
    }

    return matches;
  }

  /**
   * Calculate rule-based compatibility score
   */
  calculateRuleBasedScore(student, teacher, requirements) {
    let score = 0;

    // Rating factor (0-40 points)
    score += (teacher.rating / 5.0) * 40;

    // Experience factor (0-20 points)
    score += Math.min(teacher.experience / 5.0, 1.0) * 20;

    // Level match (0-15 points)
    if (student.currentLevel === teacher.preferredLevel) {
      score += 15;
    } else if (
      Math.abs(
        this.getLevelIndex(student.currentLevel) -
          this.getLevelIndex(teacher.preferredLevel)
      ) === 1
    ) {
      score += 10;
    }

    // Availability (0-10 points)
    if (
      teacher.availability.includes(requirements.preferredTime || "flexible")
    ) {
      score += 10;
    }

    // Budget compatibility (0-10 points)
    const maxBudget = requirements.maxBudget || 10000;
    if (teacher.hourlyRate <= maxBudget) {
      score += 10 * (1 - teacher.hourlyRate / maxBudget);
    }

    // Response time (0-5 points)
    score += Math.max(0, 5 - teacher.responseTime);

    return Math.min(score / 100, 1.0); // Normalize to 0-1
  }

  /**
   * Calculate final score combining AI and other factors
   */
  calculateFinalScore(aiScore, student, teacher, requirements) {
    // Combine AI score with additional factors
    const ruleScore = this.calculateRuleBasedScore(
      student,
      teacher,
      requirements
    );

    // Weighted combination
    return aiScore * 0.7 + ruleScore * 0.3;
  }

  /**
   * Generate human-readable match reasons
   */
  generateMatchReasons(student, teacher, score) {
    const reasons = [];

    if (teacher.rating >= 4.5) {
      reasons.push("Highly rated teacher");
    }

    if (teacher.experience >= 3) {
      reasons.push(`${teacher.experience} years of experience`);
    }

    if (teacher.isVerified) {
      reasons.push("Verified instructor");
    }

    if (score >= 0.8) {
      reasons.push("Excellent compatibility");
    } else if (score >= 0.6) {
      reasons.push("Good match");
    }

    return reasons.length ? reasons : ["Available teacher"];
  }

  /**
   * Get level index for comparison
   */
  getLevelIndex(level) {
    const levels = { beginner: 0, intermediate: 1, advanced: 2 };
    return levels[level] || 0;
  }

  /**
   * Mock function to get available teachers (replace with real database query)
   */
  async getAvailableTeachers(skillId) {
    // Mock data - replace with actual database query
    return [
      {
        id: "teacher1",
        name: "John Doe",
        rating: 4.8,
        experience: 5,
        totalSessions: 150,
        preferredLevel: "intermediate",
        availability: ["morning", "afternoon"],
        hourlyRate: 4500,
        responseTime: 2,
        completionRate: 0.95,
        isVerified: true,
      },
      {
        id: "teacher2",
        name: "Jane Smith",
        rating: 4.6,
        experience: 3,
        totalSessions: 89,
        preferredLevel: "beginner",
        availability: ["evening", "weekend"],
        hourlyRate: 3500,
        responseTime: 1,
        completionRate: 0.92,
        isVerified: true,
      },
      {
        id: "teacher3",
        name: "Mike Johnson",
        rating: 4.9,
        experience: 8,
        totalSessions: 300,
        preferredLevel: "advanced",
        availability: ["flexible"],
        hourlyRate: 6500,
        responseTime: 3,
        completionRate: 0.98,
        isVerified: true,
      },
    ];
  }

  /**
   * Mock function to get student profile (replace with real database query)
   */
  async getStudentProfile(studentId) {
    // Mock data - replace with actual database query
    return {
      id: studentId,
      currentLevel: "intermediate",
      learningGoals: ["career-change", "skill-improvement"],
      preferredLearningStyle: "interactive",
      timezone: "UTC-5",
      budget: 5000,
    };
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.initialized = false;
    console.log("🧹 Matching engine cleaned up");
  }
}

module.exports = SkillMatchingEngine;
