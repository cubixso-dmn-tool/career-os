// This file is the entry point for Vercel serverless functions
const { createServer } = require('@vercel/node');
const app = require('../server');

module.exports = createServer(app);
