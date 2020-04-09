const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
  return [
    {
      username: 'test-user-1',
      name: 'Test user 1',
      //password1!
      password_hash: '$2y$12$k00WQYVXJiNW3ugDjxBFiuheY9goSILp5p7NmLMg5GaePf49NllgG',
    },
    {
      username: 'test-user-2',
      name: 'Test user 2',
      //password1!
      password_hash: '$2y$12$k00WQYVXJiNW3ugDjxBFiuheY9goSILp5p7NmLMg5GaePf49NllgG',
    },
  ];
}

/**
 * generate fixtures of activities for a given user
 * @param {object} user - contains `id` property
 * @returns {Array(activities)} - arrays of activities
 */
function makeActivityBody() {
  
  const activities = [
    {
      name: 'Activity 1',
      description: 'Description 1',
      is_accepted: true,
      is_rejected: false,
      global_accepted_count: 3,
      category_id: 1
      // creator_id: 1,
      // category_id: null
    },
    {
      name: 'Activity 2',
      description: 'Description 2',
      is_accepted: true,
      is_rejected: false,
      global_accepted_count: 1,
      // creator_id: 1,
      category_id: 2
    },
    {
      name: 'Activity 3',
      description: 'Description 3',
      is_accepted: false,
      is_rejected: true,
      global_accepted_count: 19,
      // creator_id: 1,
      category_id: 3
    },
    {
      name: 'Activity 4',
      description: 'Description 4',
      is_accepted: true,
      is_rejected: false,
      global_accepted_count: 0,
      // creator_id: 2,
      category_id: 4
    },
    {
      name: 'Activity 5',
      description: 'Description 5',
      is_accepted: false,
      is_rejected: true,
      global_accepted_count: 100,
      // creator_id: 2,
      category_id: 5
    },
  ];
	
  return activities;
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
  });
  return `Bearer ${token}`;
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
        "app_user"`
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE app_user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE activity_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('app_user_id_seq', 0)`),
          trx.raw(`SELECT setval('activity_id_seq', 0)`),
			
        ])
      )
  );
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user
  }));
  return db.transaction(async trx => {
    await trx.into('app_user').insert(preppedUsers);
		
    await trx.raw(
      `SELECT setval('user_id_seq', ?)`,
      [users[users.length - 1].id],
    );
  });
}

/**
 * seed the databases with words and update sequence counter
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @param {array} activities - array of activity objects

 * @returns {Promise} - when all tables seeded
 */
async function seedUsersActivity(db, users, activities) {
  await seedUsers(db, users);
	
  await db.transaction(async trx => {
    await trx.into('activity').insert(activities);
		


    await Promise.all([
      trx.raw(
        `SELECT setval('language_id_seq', ?)`,
        [activities[activities.length - 1].id],
      )
    ]);
  });
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

/**
 * List of every path to be tested:
 * 
 * 
 * /api/activity (Activity Router)
 * 
 *    / 
 *      .get
 *      .post
 * 
 *    /:activity_id
 *      .get
 *      .delete?
 *      .patch
 * 
 * /api/auth  (authRouter)
 * 
 *    /token
 *      .post
 *      .put
 * 
 * /api/categories (CategoriesRouter)
 * 
 *    /
 *      .get
 *    
 *    /:cat_name
 *      .get
 * 
 * /api/profile (profileRouter)
 * 
 *    /mostpopular
 *      .get
 *    
 *    /user
 *      .get
 * 
 *    /notglobal
 *      .post
 * 
 *    /notglobal/:category_name
 *      .post
 * 
 * /api/user (userRouter)
 * 
 *    /
 *      .post
 * 
 *
 * 
 * 
 * 
 */
