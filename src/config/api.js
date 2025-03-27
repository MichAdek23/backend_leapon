const config = {
  development: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://your-production-api.com/api', // Replace with your production API URL
    timeout: 10000,
  },
  test: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
  },
};

// Get the current environment
const env = process.env.NODE_ENV || 'development';

// Export the current environment's config
export default config[env]; 