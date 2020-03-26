const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
	return knex({
		client: 'pg',
		connection: process.env.TEST_DB_URL,
	})
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
	return [
		{
			id: 1,
			username: 'test-user-1',
			name: 'Test user 1',
			password: 'password',
		},
		{
			id: 2,
			username: 'test-user-2',
			name: 'Test user 2',
			password: 'password',
		},
	]
}

/**
 * generate fixtures of languages and words for a given user
 * @param {object} user - contains `id` property
 * @returns {Array(activities)} - arrays of languages and words
 */
function makeActivityBody(user) {
	const activities = [
		{
			name: 'name mcnamey',
			description: 'ibnmstoibm'
		},
		{
			name: 'name2 mcnamey2',
			description: 'ibnmstoibm'
		},
		{
			name: 'name3 mcnamey3',
			description: 'ibnmstoibm'
},
		{
			name: 'name4 mcnamey4',
			description: 'ibnmstoibm'
		},
		{
			name: 'name5 mcname5',
			description: 'ibnmstoibm'
		},
		{
			name: 'name5 mcnamey5',
			description: 'ibnmstoibm'
		},
	]
	
	return [activities]
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
	const token = jwt.sign({ user_id: user.id }, secret, {
		subject: user.username,
		algorithm: 'HS256',
	})
	return `Bearer ${token}`
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
	return db.transaction(trx =>
		trx.raw(
			`TRUNCATE
        "activity",
        "user"`
		)
			.then(() =>
				Promise.all([
					trx.raw(`ALTER SEQUENCE app_user_id_seq minvalue 0 START WITH 1`),
					trx.raw(`ALTER SEQUENCE activity_id_seq minvalue 0 START WITH 1`),
					trx.raw(`SELECT setval('app_user_id_seq', 0)`),
					trx.raw(`SELECT setval('activity_id_seq', 0)`),
			
				])
			)
	)
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
	const preppedUsers = users.map(user => ({
		...user,
		password: bcrypt.hashSync(user.password, 1)
	}))
	return db.transaction(async trx => {
		await trx.into('user').insert(preppedUsers)
		
		await trx.raw(
			`SELECT setval('user_id_seq', ?)`,
			[users[users.length - 1].id],
		)
	})
}

/**
 * seed the databases with words and update sequence counter
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @param {array} activities - array of activity objects

 * @returns {Promise} - when all tables seeded
 */
async function seedUsersActivity(db, users, activities) {
	await seedUsers(db, users)
	
	await db.transaction(async trx => {
		await trx.into('activity').insert(activities)
		


		await Promise.all([
			trx.raw(
				`SELECT setval('language_id_seq', ?)`,
				[activities[activities.length - 1].id],
			)
		])
	})
}

module.exports = {
	makeKnexInstance,
	makeUsersArray,
	makeActivityBody,
	makeAuthHeader,
	cleanTables,
	seedUsers,
	seedUsersActivity,
};
