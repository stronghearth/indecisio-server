
const xss = require('xss');

const ActivityService = {
	/*
	The following functions are tasked with providing the api with an interface to
	utulize the database.
	 */
	
	/*
	Grabs all Activitys from the table called 'activity'
	 */
	getAllActivity(db) {
		return db.select('*').from('activity')
	},
	
	/*
	Inserts a user created Activity into the table called 'activity'
	 */
	insertActivity(db, newActivity) {
		debugger
		return db
			.insert(newActivity)
			.into('activity')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},
	
	/*
	Finds a Activity based on the Activitys unique id
	 */
	getById(db, id) {
		return db
			.from('activity')
			.select('*')
			.where({ id })
			.first()
	},
	
	/*
	Removes a Activity from the database based on its unique id
	 */
	deleteActivity(db, id) {
		return db('activity')
			.where({ id })
			.delete()
	},
	updateActivity(db, id, newActivityFields) {
		return db
			.from('activity')
			.where( id )
			.update(newActivityFields)
	},
	
	serializeActivities(activities) {
		return activities.map(this.serializeActivity)
	},
	
	serializeActivity(activity) {
		
		return {
			id: activity.id,
			name: xss(activity.name),
			description: xss(activity.description),
			isAccepted: activity.isAccepted,
			isRejected: activity.isRejected
		}
	}
};
module.exports = ActivityService;

