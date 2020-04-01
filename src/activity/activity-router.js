const express = require('express');
const ActivityService = require('./activity-service');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth')
const bodyParser = express.json();
const ActivityRouter = express.Router();



ActivityRouter
	.route('/')
	.all(requireAuth)
	.get((req,res,next) => {
		const db = req.app.get('db');
		ActivityService.getAllActivity(db)
			.then(activities => {
				res.json(ActivityService.serializeActivities(activities))
			})
			.catch(next);
	})
	.post(bodyParser, (req, res, next) => {
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
	})
	

ActivityRouter
	.route('/:activity_id')
	.all(requireAuth)
	.all((req,res,next) => {
		const db = req.app.get('db');
		
		ActivityService.getById(db, req.params.activity_id)
			.then(activity => {
				if(!activity) {
					return res.status(404).json({
						error: {message: 'Activity not found'}
					})
				}
				res.activity = activity;
				next()
			})
			.catch(next)
	})
	
	.get((req,res) => {
		res.json(ActivityService.serializeActivity(res.activity))
	})
	
	.delete((req,res,next) => {
		const db = req.app.get('db');
		const activity_id = req.params.activity_id;
		
		ActivityService.deleteActivity(db, Activity_id)
			.then(numRowsAffected => {
				res.status(204).end()
			})
			.catch(next);
	})
	
	.patch(bodyParser, (req,res,next) => {
		const { name, description, is_accepted, is_rejected } = req.body;

		const ActivityToUpdate = { name, description, is_accepted, is_rejected };
		console.log(req.params.activity_id, ActivityToUpdate)
		const numberOfValues = Object.values(ActivityToUpdate).filter(Boolean).length;
		if (numberOfValues === 0) {
			return res.status(400).json({
				error: {
					message: `Request body must contain at least one of the following keys: 'name', 'description', 'is_accepted', 'is_rejected'`
				}
			})
		}
		
		ActivityService.updateActivity(
			req.app.get('db'),
			req.params.activity_id,
			ActivityToUpdate
		)
			.then(numRowsAffected => {
				console.log(res)
				res.status(204).end()
			})
			.catch(next)
	});






module.exports = ActivityRouter;