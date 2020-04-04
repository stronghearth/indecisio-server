const express = require('express');
const CategoriesService = require('./categories-service');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');
const bodyParser = express.json();
const CategoriesRouter = express.Router();
const ActivitiesService = require('../activity/activity-service');

/**
 * The next routers are for categories. We need to move these
 * to the profile router when it is created
 */

CategoriesRouter
  .route('/')
  .get((req,res,next) => {
    const db = req.app.get('db');
    CategoriesService.getCategories(db)
      .then(categories => {
        res.json(categories);
      })
      .catch(next);
  });

CategoriesRouter
  .route('/:cat_name')
  .all(requireAuth)
  .get((req,res,next) => {
    const db = req.app.get('db');
		
    CategoriesService.getCategoryIdFromName(db, req.params.cat_name)
      .then(category => {
        if(!category) {
          return res.status(404).json({
            error: {message: 'Activity not found'}
          });
        }
        CategoriesService.getActivitiesByCategory(db, category.id)
          .then(activities => {
            
            if (activities.length === 0) {
              console.log('With empty array, activities: ', activities);
              /**
               * What should we return here?
               */
              return res.status(201).json('No activity with that category');
            }
            return res.status(201).json(activities);
          });
      
      })
      .catch(next);
  });
	
// 	.get((req,res) => {
// 		res.json(ActivityService.serializeActivity(res.category))
// 	})

module.exports = CategoriesRouter;