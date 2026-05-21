export const APP_NAME = 'SMT-Membership-Card-App';
export const VERSION = '1.0.0';
export const API_URL = process.env.API_URL || 'http://localhost:3000';
export const isProduction = process.env.NODE_ENV === 'production';

export default {
    APP_NAME,
    VERSION,
    API_URL,
    isProduction
};
