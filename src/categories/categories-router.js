const express = require('express');
const CategoriesService = require('./categories-service');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth')
const bodyParser = express.json();
const CategoriesRouter = express.Router();

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
				res.json(categories)
			})
			.catch(next);
	})

// ActivityRouter
// 	.route('/api/activity/:category_id')
// 	.all(requireAuth)
// 	.all((req,res,next) => {
// 		const db = req.app.get('db');
		
// 		ActivityService.getCategoryById(db, req.params.category_id)
// 			.then(category => {
// 				if(!category) {
// 					return res.status(404).json({
// 						error: {message: 'Activity not found'}
// 					})
// 				}
// 				res.category = category
// 				next()
// 			})
// 			.catch(next)
// 	})
	
// 	.get((req,res) => {
// 		res.json(ActivityService.serializeActivity(res.category))
// 	})

module.exports = CategoriesRouter