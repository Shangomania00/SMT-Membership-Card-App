// SMT Membership Card App Constants
export const APP_CONFIG = {
  name: 'SMT Membership Card App',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'production'
};

export const API_ROUTES = {
  members: '/api/members',
  cards: '/api/cards',
  auth: '/api/auth'
};

export const DATABASE_CONFIG = {
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'smt_membership'
};

export default {
  APP_CONFIG,
  API_ROUTES,
  DATABASE_CONFIG
};
