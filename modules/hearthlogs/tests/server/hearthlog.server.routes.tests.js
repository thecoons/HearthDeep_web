'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hearthlog = mongoose.model('Hearthlog'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  hearthlog;

/**
 * Hearthlog routes tests
 */
describe('Hearthlog CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Hearthlog
    user.save(function () {
      hearthlog = {
        name: 'Hearthlog name'
      };

      done();
    });
  });

  it('should be able to save a Hearthlog if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hearthlog
        agent.post('/api/hearthlogs')
          .send(hearthlog)
          .expect(200)
          .end(function (hearthlogSaveErr, hearthlogSaveRes) {
            // Handle Hearthlog save error
            if (hearthlogSaveErr) {
              return done(hearthlogSaveErr);
            }

            // Get a list of Hearthlogs
            agent.get('/api/hearthlogs')
              .end(function (hearthlogsGetErr, hearthlogsGetRes) {
                // Handle Hearthlogs save error
                if (hearthlogsGetErr) {
                  return done(hearthlogsGetErr);
                }

                // Get Hearthlogs list
                var hearthlogs = hearthlogsGetRes.body;

                // Set assertions
                (hearthlogs[0].user._id).should.equal(userId);
                (hearthlogs[0].name).should.match('Hearthlog name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Hearthlog if not logged in', function (done) {
    agent.post('/api/hearthlogs')
      .send(hearthlog)
      .expect(403)
      .end(function (hearthlogSaveErr, hearthlogSaveRes) {
        // Call the assertion callback
        done(hearthlogSaveErr);
      });
  });

  it('should not be able to save an Hearthlog if no name is provided', function (done) {
    // Invalidate name field
    hearthlog.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hearthlog
        agent.post('/api/hearthlogs')
          .send(hearthlog)
          .expect(400)
          .end(function (hearthlogSaveErr, hearthlogSaveRes) {
            // Set message assertion
            (hearthlogSaveRes.body.message).should.match('Please fill Hearthlog name');

            // Handle Hearthlog save error
            done(hearthlogSaveErr);
          });
      });
  });

  it('should be able to update an Hearthlog if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hearthlog
        agent.post('/api/hearthlogs')
          .send(hearthlog)
          .expect(200)
          .end(function (hearthlogSaveErr, hearthlogSaveRes) {
            // Handle Hearthlog save error
            if (hearthlogSaveErr) {
              return done(hearthlogSaveErr);
            }

            // Update Hearthlog name
            hearthlog.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Hearthlog
            agent.put('/api/hearthlogs/' + hearthlogSaveRes.body._id)
              .send(hearthlog)
              .expect(200)
              .end(function (hearthlogUpdateErr, hearthlogUpdateRes) {
                // Handle Hearthlog update error
                if (hearthlogUpdateErr) {
                  return done(hearthlogUpdateErr);
                }

                // Set assertions
                (hearthlogUpdateRes.body._id).should.equal(hearthlogSaveRes.body._id);
                (hearthlogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Hearthlogs if not signed in', function (done) {
    // Create new Hearthlog model instance
    var hearthlogObj = new Hearthlog(hearthlog);

    // Save the hearthlog
    hearthlogObj.save(function () {
      // Request Hearthlogs
      request(app).get('/api/hearthlogs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Hearthlog if not signed in', function (done) {
    // Create new Hearthlog model instance
    var hearthlogObj = new Hearthlog(hearthlog);

    // Save the Hearthlog
    hearthlogObj.save(function () {
      request(app).get('/api/hearthlogs/' + hearthlogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', hearthlog.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Hearthlog with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hearthlogs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Hearthlog is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Hearthlog which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Hearthlog
    request(app).get('/api/hearthlogs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Hearthlog with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Hearthlog if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hearthlog
        agent.post('/api/hearthlogs')
          .send(hearthlog)
          .expect(200)
          .end(function (hearthlogSaveErr, hearthlogSaveRes) {
            // Handle Hearthlog save error
            if (hearthlogSaveErr) {
              return done(hearthlogSaveErr);
            }

            // Delete an existing Hearthlog
            agent.delete('/api/hearthlogs/' + hearthlogSaveRes.body._id)
              .send(hearthlog)
              .expect(200)
              .end(function (hearthlogDeleteErr, hearthlogDeleteRes) {
                // Handle hearthlog error error
                if (hearthlogDeleteErr) {
                  return done(hearthlogDeleteErr);
                }

                // Set assertions
                (hearthlogDeleteRes.body._id).should.equal(hearthlogSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Hearthlog if not signed in', function (done) {
    // Set Hearthlog user
    hearthlog.user = user;

    // Create new Hearthlog model instance
    var hearthlogObj = new Hearthlog(hearthlog);

    // Save the Hearthlog
    hearthlogObj.save(function () {
      // Try deleting Hearthlog
      request(app).delete('/api/hearthlogs/' + hearthlogObj._id)
        .expect(403)
        .end(function (hearthlogDeleteErr, hearthlogDeleteRes) {
          // Set message assertion
          (hearthlogDeleteRes.body.message).should.match('User is not authorized');

          // Handle Hearthlog error error
          done(hearthlogDeleteErr);
        });

    });
  });

  it('should be able to get a single Hearthlog that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Hearthlog
          agent.post('/api/hearthlogs')
            .send(hearthlog)
            .expect(200)
            .end(function (hearthlogSaveErr, hearthlogSaveRes) {
              // Handle Hearthlog save error
              if (hearthlogSaveErr) {
                return done(hearthlogSaveErr);
              }

              // Set assertions on new Hearthlog
              (hearthlogSaveRes.body.name).should.equal(hearthlog.name);
              should.exist(hearthlogSaveRes.body.user);
              should.equal(hearthlogSaveRes.body.user._id, orphanId);

              // force the Hearthlog to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Hearthlog
                    agent.get('/api/hearthlogs/' + hearthlogSaveRes.body._id)
                      .expect(200)
                      .end(function (hearthlogInfoErr, hearthlogInfoRes) {
                        // Handle Hearthlog error
                        if (hearthlogInfoErr) {
                          return done(hearthlogInfoErr);
                        }

                        // Set assertions
                        (hearthlogInfoRes.body._id).should.equal(hearthlogSaveRes.body._id);
                        (hearthlogInfoRes.body.name).should.equal(hearthlog.name);
                        should.equal(hearthlogInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Hearthlog.remove().exec(done);
    });
  });
});
