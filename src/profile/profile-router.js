const express = require('express')
const ActivityService = require('../activity/activity-service')
const ProfileService = require('./profile-service')
const { requireAuth } = require('../middleware/jwt-auth')
const ProfileRouter = express.Router();

ProfileRouter
    .route('/mostpopular')
    .get(async (req, res, next) => {
        const db = req.app.get('db')

        const activitiesList = await ActivityService.getAllActivity(db)
        console.log("ACTIVITIES", activitiesList)
        const result = await ProfileService.getSingleGlobalAcitiviyAcceptance(db, 2)
        const aggregatedResults = await activitiesList.forEach(activity => ProfileService.getSingleGlobalAcitiviyAcceptance(db, activity.id))
        //results = [ {count: '4'},{count: '5'}]
        console.log('SINGLE RESULT', result)
        console.log('AGGREGATED', aggregatedResults)
    })

module.exports = ProfileRouter