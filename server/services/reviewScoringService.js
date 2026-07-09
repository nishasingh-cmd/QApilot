/**
 * Review Scoring Service.
 * Computes, normalizes, and validates category scores and overall scores for code reviews.
 */
export const calculateReviewScores = (comments, aiScores = {}) => {
  // Starting scores for each category
  const categories = {
    security: 100,
    performance: 100,
    maintainability: 100,
    readability: 100
  };

  // If aiScores are provided, we use them
  if (aiScores.securityScore !== undefined && !isNaN(aiScores.securityScore)) categories.security = aiScores.securityScore;
  if (aiScores.performanceScore !== undefined && !isNaN(aiScores.performanceScore)) categories.performance = aiScores.performanceScore;
  if (aiScores.maintainabilityScore !== undefined && !isNaN(aiScores.maintainabilityScore)) categories.maintainability = aiScores.maintainabilityScore;
  if (aiScores.readabilityScore !== undefined && !isNaN(aiScores.readabilityScore)) categories.readability = aiScores.readabilityScore;

  const hasComments = Array.isArray(comments) && comments.length > 0;
  
  if (hasComments) {
    // Implement standard dynamic fallback calculations
    const calculated = {
      security: 100,
      performance: 100,
      maintainability: 100,
      readability: 100
    };

    comments.forEach(c => {
      const cat = (c.category || "").toLowerCase();
      let key = "";
      if (cat === "security") key = "security";
      else if (cat === "performance") key = "performance";
      else if (cat === "readability") key = "readability";
      else key = "maintainability"; // fallback for quality, best_practices, architecture, testing

      let deduction = 2;
      if (c.severity === "critical") deduction = 20;
      else if (c.severity === "warning") deduction = 10;

      calculated[key] -= deduction;
    });

    // Bound calculated scores between 10 and 100
    Object.keys(calculated).forEach(k => {
      calculated[k] = Math.max(10, Math.min(100, calculated[k]));
    });

    // If aiScores are missing or blank, use calculated values
    if (aiScores.securityScore === undefined || isNaN(aiScores.securityScore)) categories.security = calculated.security;
    if (aiScores.performanceScore === undefined || isNaN(aiScores.performanceScore)) categories.performance = calculated.performance;
    if (aiScores.maintainabilityScore === undefined || isNaN(aiScores.maintainabilityScore)) categories.maintainability = calculated.maintainability;
    if (aiScores.readabilityScore === undefined || isNaN(aiScores.readabilityScore)) categories.readability = calculated.readability;
  }

  // Ensure all values are 0-100
  categories.security = Math.max(0, Math.min(100, Math.round(categories.security)));
  categories.performance = Math.max(0, Math.min(100, Math.round(categories.performance)));
  categories.maintainability = Math.max(0, Math.min(100, Math.round(categories.maintainability)));
  categories.readability = Math.max(0, Math.min(100, Math.round(categories.readability)));

  // Overall Score is the average of category scores if not explicitly provided
  let overallScore = aiScores.overallScore;
  if (overallScore === undefined || isNaN(overallScore) || overallScore <= 0) {
    overallScore = (categories.security + categories.performance + categories.maintainability + categories.readability) / 4;
  }
  overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

  return {
    overallScore,
    securityScore: categories.security,
    performanceScore: categories.performance,
    maintainabilityScore: categories.maintainability,
    readabilityScore: categories.readability
  };
};

export default { calculateReviewScores };
