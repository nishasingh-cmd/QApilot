/**
 * Reusable Authentication Configuration
 * Easy switch configuration for backend integration.
 * In a future phase, update these URIs/APIs to point to your real backend endpoints.
 */
export const authConfig = {
  // Toggle this flag to switch between dummy simulation and real backend API calls.
  useMockAuth: false,

  // Base API endpoint URL (configured via environment variables or fallback to localhost)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // Authentication endpoints
  endpoints: {
    login: '/auth/login',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    githubOAuth: '/auth/oauth/github',
    googleOAuth: '/auth/oauth/google',
  },

  // Client validation requirements
  validation: {
    passwordMinLength: 8,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  // Simulated request delay in milliseconds
  mockDelayMs: 1200,
};
