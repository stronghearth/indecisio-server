const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');

describe('Category Routes', () => {
  let dummyUsers = testHelpers.makeUsersArray();
  let dummyActivities = testHelpers.makeActivityBody();
  let dummyCategories = [{cat_name: 'Entertainment'}, {cat_name: 'Chores'}, {cat_name: 'Learn'}, {cat_name: 'Fitness'}, {cat_name: 'Socialize'}];
  

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

    describe('GET /api/categories', () => {
      before('we need categories', () => {
        return db
          .into('category')
          .insert(dummyCategories);
      });
      it('Returns with a list of the categories and their ids', () => {
        return supertest(app)
          .get('/api/categories')
          .set('Authorization', testUser)
          .expect(200)
          .expect(res => {
            for (let i = 0; i < res.length; i++) {
              expect(res.body[i].cat_name).to.equal(dummyCategories[i].cat_nam);
            }
          });

      });
    });

  });
});