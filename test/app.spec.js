const app = require('../src/app');
const knex = require('knex');


describe('App', () => {
  context('activity endpoints', () => {
    let db;

    let exampleActivityReturn =
      [
        {
          "name": "Pushdowns",
          "description": "Jump and give me 0.5"
        },
        {
          "name": "Learn everything there is to know about the socratic paradox",
          "description": "This should take about two hours to complete"
        }
      ];
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL
      });
      app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db('activity').truncate());

    

    context('GET /api/activity with empty db', () => {
      it('GET /api/activity responds with empty array if empty', () => {
        return supertest(app)
          .get('/api/activity')
          .expect(200, []);
      });
    });
    
    context('GET /api/activity with info in db', () => {
      beforeEach('inserting data', () => {
        return db
          .into('activity')
          .insert(exampleActivityReturn);
          
      });
  
      afterEach('clean the table', () => db('activity').truncate());
      
      it('GET /api/activity responds with list of activities', () => {
        return supertest(app)
          .get('/api/activity');
  
      });
    });
    

  });
  
  /*
  * Adding
  * */
  
  
  
});