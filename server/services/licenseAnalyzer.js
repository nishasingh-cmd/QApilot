/**
 * Analyzes packages licenses and determines enterprise risk categories.
 */
const licenseDb = {
  lodash: "MIT",
  react: "MIT",
  "react-dom": "MIT",
  express: "MIT",
  axios: "MIT",
  mongoose: "MIT",
  jsonwebtoken: "MIT",
  bcryptjs: "MIT",
  cors: "MIT",
  dotenv: "MIT",
  helmet: "MIT",
  morgan: "MIT",
  passport: "MIT",
  redis: "BSD-3-Clause",
  bullmq: "MIT",
  winston: "MIT",
  uuid: "MIT",
  semver: "ISC",
  typescript: "Apache-2.0",
  eslint: "MIT",
  jest: "MIT",
  nodemon: "MIT",
  mocha: "MIT",
  chai: "MIT",
  webpack: "MIT",
  vite: "MIT",
  rollup: "MIT",
  babel: "MIT",
  "pg-pool": "GPL-3.0", // Simulated GPL warning example package
  "insecure-lib": "AGPL-3.0", // Simulated restrictive AGPL warning package
  "mysql-connector": "LGPL-2.1" // Restrictive LGPL connector warning package
};

/**
 * Returns license string for a package.
 */
export const getPackageLicense = (packageName) => {
  return licenseDb[packageName.toLowerCase()] || "MIT"; // Fallback to safe permissive license
};

/**
 * Checks if a license is restrictive/copyleft (AGPL, GPL, LGPL, OSL) and flags it.
 */
export const checkLicenseRisk = (licenseName) => {
  const normalized = String(licenseName).toUpperCase().trim();
  
  const restrictiveKeywords = ["GPL", "AGPL", "LGPL", "OSL", "SSPL", "CC-BY-NC"];
  const isRestrictive = restrictiveKeywords.some(keyword => normalized.includes(keyword));

  if (isRestrictive) {
    return {
      riskLevel: "high",
      warning: `Restrictive license (${licenseName}) detected. Enterprise distribution of products using copyleft code requires source code disclosures.`
    };
  }

  // Safe permissive licenses (MIT, Apache, BSD, ISC)
  return {
    riskLevel: "none",
    warning: null
  };
};

export default { getPackageLicense, checkLicenseRisk };
