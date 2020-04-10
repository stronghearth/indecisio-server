const app = require('../src/app');
const knex = require('knex');
const testHelpers = require('./test-helpers');

describe('Auth Routes', () => {
  let dummyUsers = testHelpers.makeUsersArray();
  
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

    let testLogin = {
      username: dummyUsers[0].username, 
      password: 'password1!'
    };

    after('disconnect from db', () => db.destroy());    

    describe('POST /api/auth/token', () => {
      
      it('Responds with 200 and a jwt if the username and password are correct', () => {
        return supertest(app)
          .post('/api/auth/token')
          .send(testLogin)
          .expect(200)
          .expect(res => expect(res.body).to.have.all.keys('authToken'));
      });
    });

    describe('PATCH /api/auth/token', () => {
      let testToken = {
        user: {
          id: 1, 
          name: 'fred'
        }
      };
      let testUser = (testHelpers.makeAuthHeader(dummyUsers[0]));
      it('Responds with 200 and a jwt based on user_id and name', () => {
        return supertest(app)
          .put('/api/auth/token')
          .set('Authorization', testUser)
          .send(testToken)
          .expect(200)
          .expect(res => expect(res.body).to.have.all.keys('authToken'));
      });
    });
    
    describe('POST /api/user', () => {
      let newUser = {
        name: 'Billy Bonka',
        username: 'billy',
        password: 'Password1!'
      };
      it('Responds with 201 when new profile is successfully created', () => {
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201);
      });
    });
  });
});
