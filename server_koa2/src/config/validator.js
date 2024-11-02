// config/validator.js
const validateEnv = () => {
    const errors = [];
    const required = [
      'NODE_ENV',
      'PORT',
      'DB_HOST',
      'DB_PORT',
      'DB_NAME',
      'DB_USER',
      'DB_PASSWORD',
      'JWT_SECRET'
    ];
  
    required.forEach(key => {
      if (!process.env[key]) {
        errors.push(`Missing required environment variable: ${key}`);
      }
    });
  
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  };