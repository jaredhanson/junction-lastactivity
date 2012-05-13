/**
 * Module dependencies.
 */
var lastActivity = require('./middleware/lastActivity')
  , lastActivityResultParser = require('./middleware/lastActivityResultParser');

/**
 * Expose middleware.
 */
exports = module.exports = lastActivity;
exports.lastActivity = lastActivity;
exports.lastActivityResultParser = lastActivityResultParser;
