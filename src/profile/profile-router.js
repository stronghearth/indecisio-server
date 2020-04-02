const express = require('express')
const ActivityService = require('../activity/activity-service')
const ProfileService = require('./profile-service')
const { requireAuth } = require('../middleware/jwt-auth')
const ProfileRouter = express.Router();

ProfileRouter
    .route('/mostpopular')
    .get((req, res, next) => {
        const db = req.app.get('db')

        ProfileService.getTopActivitiesList(db)
            .then(activities => res.json(activities))
            .catch(next)
    })

ProfileRouter
    .route('/user')
    .all(requireAuth)
    .get((req, res, next) => {
        const db = req.app.get('db')

        ProfileService.getUserTopActivitiesList(db, req.user.id)
        .then(activities => {
            res.json(activities)
        })
        .catch(next)
    })


module.exports = ProfileRouter