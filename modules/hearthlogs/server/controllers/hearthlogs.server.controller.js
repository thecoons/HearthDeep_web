'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hearthlog = mongoose.model('Hearthlog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Hearthlog
 */
exports.create = function(req, res) {
  var hearthlog = new Hearthlog(req.body);
  hearthlog.user = req.user;

  hearthlog.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hearthlog);
    }
  });
};

/**
 * Show the current Hearthlog
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var hearthlog = req.hearthlog ? req.hearthlog.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  hearthlog.isCurrentUserOwner = req.user && hearthlog.user && hearthlog.user._id.toString() === req.user._id.toString();

  res.jsonp(hearthlog);
};

/**
 * Update a Hearthlog
 */
exports.update = function(req, res) {
  var hearthlog = req.hearthlog;

  hearthlog = _.extend(hearthlog, req.body);

  hearthlog.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hearthlog);
    }
  });
};

/**
 * Delete an Hearthlog
 */
exports.delete = function(req, res) {
  var hearthlog = req.hearthlog;

  hearthlog.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hearthlog);
    }
  });
};

/**
 * List of Hearthlogs
 */
exports.list = function(req, res) {
  Hearthlog.find().sort('-created').populate('user', 'displayName').exec(function(err, hearthlogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hearthlogs);
    }
  });
};

/**
 * Hearthlog middleware
 */
exports.hearthlogByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hearthlog is invalid'
    });
  }

  Hearthlog.findById(id).populate('user', 'displayName').exec(function (err, hearthlog) {
    if (err) {
      return next(err);
    } else if (!hearthlog) {
      return res.status(404).send({
        message: 'No Hearthlog with that identifier has been found'
      });
    }
    req.hearthlog = hearthlog;
    next();
  });
};
