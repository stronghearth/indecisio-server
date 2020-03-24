const express = require('express');
const ActivityService = require('./activity-service');
const path = require('path');
const bodyParser = express.json();
const ActivityRouter = express.Router();

ActivityRouter.post('/', bodyParser,(req,res,next) => {
	const db = req.app.get('db');
	
	const { name, description } = req.body;
	const newActivity = { name, description };
		
		for (const [key, value] of Object.entries(newActivity)) {
			if (value === null ) {
				return res.json({
					error: { message : `Missing ${key} in request body`}
				})
			}
		}
		
		ActivityService.insertActivity(db, newActivity)
			
			.then(activity => {
				res
					.status(201)
					.location(path.posix.join(req.originalUrl, `${activity.id}`))
					.json(ActivityService.serializeActivity(activity))
			})
			.catch(next);
	});

module.exports = ActivityRouter;
