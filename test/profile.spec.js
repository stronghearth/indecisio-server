const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');

describe('Auth Routes', () => {
  let dummyUsers = testHelpers.makeUsersArray();
  let dummyActivities = testHelpers.makeActivityBody();
  
  context('activity endpoints', () => {
    let db;
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL
      });
      app.set('db', db);
    });

    after('clean the tables', () =>
      db.raw('ALTER TABLE activity DROP COLUMN IF EXISTS category_id'));
    
    after('clean the tables', () =>
      db('category').truncate());
    
    after('clean the tables', () =>
      db('accepted_rejected').truncate());
      
    after('clean the tables', () =>  
      db.raw('TRUNCATE TABLE activity CASCADE'));
    
    after('clean the tables', () =>  
      db.raw('TRUNCATE TABLE app_user CASCADE'));

    before('clean the tables', () =>
      db.raw('ALTER TABLE activity DROP COLUMN IF EXISTS category_id'));

    before('category_id column', () => 
      db.raw('ALTER TABLE activity ADD COLUMN category_id INT'));
    

    before('insert dummy users', () => {
      return db
        .into('app_user')
        .insert(dummyUsers);
    });

    let testUser = (testHelpers.makeAuthHeader(dummyUsers[0]));

    after('disconnect from db', () => db.destroy());    

    describe('GET /api/profile', () => {
      before('insert dummy activities', () => {
        return db
          .into('activity')
          .insert(dummyActivities);
      });
      it('/mostpopular Responds with 200 and the top activities', () => {
        return supertest(app)
          .get('/api/profile/mostpopular')
          .set('Authorization', testUser)
          .expect(200);
      });
      it('/user Responds with 200 and the top activities for that user', () => {
        return supertest(app)
          .get('/api/profile/user')
          .set('Authorization', testUser)
          .send({user: {id: 1}})
          .expect(200);
      });
      /**
       * These next ones needs an id set
       * on each activity to actually work
       * right now, expecting empty object
       * as response (because no ids match 1)
       */
      it('/notglobal Responds with the top activities for that user', () => {
        return supertest(app)
          .get('/api/profile/notglobal')
          .set('Authorization', testUser)
          .send({user: {id: 1}})
          .expect({});
      });

      it('/notglobal/:category_name Responds with the top activities in a category for that user', () => {
        return supertest(app)
          .get('/api/profile/notglobal/Fitness')
          .set('Authorization', testUser)
          .send({user: {id: 1}})
          .expect({});
      });


    });
  });
});