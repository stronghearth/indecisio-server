module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL:process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET ,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    API_KEY: process.env.API_KEY,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h'
};