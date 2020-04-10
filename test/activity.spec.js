const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');


describe('Activity Routes', () => {
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

    // {
    //   name: newActivity.name,
    //   description: newActivity.description,
    //   category_id: newActivity.category,
    //   creator_id: newActivity.creator
    // }

    describe('POST /api/activity', () => {
      let dummyPost = {
        name: 'Test post activity',
        description: 'Testing out the post endpoint',
        // creator_id: 1, 
        // category_id: 1
      };

      it('POSTS the new activity and returns a successful creation message', async () => {
        await supertest(app)
          .post('/api/activity')
          .set('Authorization', testUser)
          .send(dummyPost)
          .expect(201);
          
      });
      
    });
    
    describe('GET /api/categories/:category_name', () => {
      before('insert dummy activities', () => {
        return db
          .into('activity')
          .insert(dummyActivities);
      });
      before('we need categories', () => {
        return db
          .into('category')
          .insert([{cat_name: 'Entertainment'}, {cat_name: 'Chores'}, {cat_name: 'Learn'}, {cat_name: 'Fitness'}, {cat_name: 'Socialize'}]);
      });
      it('responds with activities with matching activity_id', () => {
        let cat_name = 'Entertainment';
        return supertest(app)
          .get(`/api/categories/${cat_name}`)
          .set('Authorization', testUser)
          .expect(201)
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

    

    describe('PATCH /api/activity/:activity_id', () => {
      before('insert dummy activities', () => {
        return db
          .into('activity')
          .insert(dummyActivities);
      });
      before('we need categories', () => {
        return db
          .into('category')
          .insert([{cat_name: 'Entertainment'}, {cat_name: 'Chores'}, {cat_name: 'Learn'}, {cat_name: 'Fitness'}, {cat_name: 'Socialize'}]);
      });

      let updatedDummyActivity = {
        name: 'Activity 1',
        description: 'Description 1',
        is_accepted: false,
        is_rejected: true,
        global_accepted_count: 3,
        category_id: 1
      };

      it('successfully PATCHES an activity and responds with 204', async () => {
        let activity_id = await supertest(app).get('/api/activity').set('Authorization', testUser).then(res => res.body[0].id);
        return supertest(app)
          .patch(`/api/activity/${activity_id}`)
          .set('Authorization', testUser)
          .send(updatedDummyActivity)
          .expect(204);

            
      });    
    });
  });
});

  
  
  
