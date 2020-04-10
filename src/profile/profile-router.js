const express = require('express');
const ProfileService = require('./profile-service');
const CategoriesService = require('../categories/categories-service')
const ActivitiesService = require('../activity/activity-service')
const { requireAuth } = require('../middleware/jwt-auth');
const ProfileRouter = express.Router();

ProfileRouter
  .route('/mostpopular')
  .get((req, res, next) => {
    const db = req.app.get('db');

    ProfileService.getTopActivitiesList(db)
      .then(activities => {
          res.json(activities)
      })
      .catch(next);
  });

ProfileRouter
  .route('/user')
  .all(requireAuth)
  .get((req, res, next) => {
    const db = req.app.get('db');

    ProfileService.getUserTopActivitiesList(db, req.user.id)
      .then(activities => {
        res.json(activities);
      })
      .catch(next);
  });


/**
 * These last two need to be moved,
 * I just put them here to avoid dynamic 
 * routing issues until we have concensus on
 * how to organize the routers
 */
ProfileRouter
  .route('/notglobal')
  .all(requireAuth)
  .post((req, res, next) => {
    const db = req.app.get('db');

    ActivitiesService.getAllUserActivity(db, req.user.id)
      .then(activities => {
        res.json(activities);
      })
      .catch(next);
  });

ProfileRouter
  .route('/notglobal/:category_name')
  .all(requireAuth)
  .post((req, res, next) => {
    const db = req.app.get('db');
    CategoriesService.getCategoryIdFromName(db, req.params.category_name)
      .then(category_id => 
        CategoriesService.getUserActivitiesByCategory(db, req.user.id, category_id)
          .then(activities => {
            res.json(activities);
          })
          .catch(next)
      );
  });

module.exports = ProfileRouter;
