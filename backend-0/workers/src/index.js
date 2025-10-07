
// Workers Entry Point
require('dotenv').config();
const Bull = require('bull');
const { modules } = require('../../shared/moduleResolver');

console.log('Worker services started');

// Start specific workers
require('./analytics-worker');
require('./data-sync');
require('./email-worker');
require('./payment-processor');
