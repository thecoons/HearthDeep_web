'use strict';

/**
 * Module dependencies
 */
var hearthlogsPolicy = require('../policies/hearthlogs.server.policy'),
  hearthlogs = require('../controllers/hearthlogs.server.controller');

module.exports = function(app) {
  // Hearthlogs Routes
  app.route('/api/hearthlogs').all(hearthlogsPolicy.isAllowed)
    .get(hearthlogs.list)
    .post(hearthlogs.create);

  app.route('/api/hearthlogs/:hearthlogId').all(hearthlogsPolicy.isAllowed)
    .get(hearthlogs.read)
    .put(hearthlogs.update)
    .delete(hearthlogs.delete);

  // Finish by binding the Hearthlog middleware
  app.param('hearthlogId', hearthlogs.hearthlogByID);
};
