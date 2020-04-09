const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');


describe('Activity Routes', () => {
  let dummyUsers = testHelpers.makeUsersArray();
  let dummyActivities = testHelpers.makeActivityBody();
  let testUser = (testHelpers.makeAuthHeader(dummyUsers[0]));

  context('activity endpoints', () => {
    let db;
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL
      });
      app.set('db', db);
    });

    before('clean the tables', () =>
      db.raw('ALTER TABLE activity DROP COLUMN IF EXISTS category_id'));
    
    before('clean the tables', () =>
      db('category').truncate());
    
    before('clean the tables', () =>
      db('accepted_rejected').truncate());
      
    before('clean the tables', () =>  
      db.raw('TRUNCATE TABLE activity CASCADE'));
    
    before('clean the tables', () =>  
      db.raw('TRUNCATE TABLE app_user CASCADE'));
    

    before('insert dummy users', () => {
      return db
        .into('app_user')
        .insert(dummyUsers);
    });

    

    after('disconnect from db', () => db.destroy());    

    describe('GET /api/activity with empty db', () => {
      it('GET /api/activity responds with empty array if empty', () => {
        return supertest(app)
          .get('/api/activity')
          .set('Authorization', testUser)
          .expect(200, []);
      });
    });
    
    context('GET /api/activity with info in db', () => {
      before('insert dummy activities', () => {
        return db
          .into('activity')
          .insert(dummyActivities);
      });

      it('GET /api/activity responds with list of activities', () => {
        return supertest(app)
          .get('/api/activity')
          .set('Authorization', testUser)
          .expect(200)
          .expect(res => {
            for (let i = 0; i < res.length; i++) {
              expect(res.body[i].name).to.equal(dummyActivities[i].name);
              expect(res.body[i].description).to.equal(dummyActivities[i].description);
              expect(res.body[i].is_accepted).to.equal(dummyActivities[i].is_accepted);
              expect(res.body[i].is_rejected).to.equal(dummyActivities[i].is_rejected);
            }
          });
      });
    });

    describe('POST /api/activity', () => {

    })
    
    describe('GET /api/activity/:activity_id', () => {

    })

    

    describe('PATCH /api/activity/:activity_id', () => {

    })


    

  });
  
  /*
  * Adding
  * */
  
  
  
});