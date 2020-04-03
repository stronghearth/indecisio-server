
const xss = require('xss');

const ActivityService = {
	/*
	The following functions provide the api with an interface to
	alter  the database.
	 */
	
	/*
	Grabs all Activitys from the table called 'activity'
	 */
	getAllActivity(db) {
		return db
				.select('*')
				.from('activity')
				.orderBy('id')
	},
	
	/*
	Inserts a user created Activity into the table called 'activity'
	 */
	insertActivity(db, newActivity) {
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
			.where({ id })
			.update(newActivityFields)

	},
	
	getCategoryIdByName(db, name) {
		return db
			.from('category')
			.select('id')
			.where({ name })
	},
	
	
	serializeActivities(activities) {
		return activities.map(this.serializeActivity)
	},
	
	serializeActivity(activity) {
		
		return {
			id: activity.id,
			name: xss(activity.name),
			category_id: xss(activity.category_id),
			description: xss(activity.description),
			is_accepted: activity.is_accepted,
			is_rejected: activity.is_rejected
		}
	}
};
module.exports = ActivityService;

