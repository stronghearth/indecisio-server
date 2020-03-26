const  helpers = require('./test-helpers');

/**
 * @description Submit a new activity
 **/
describe(`POST /api/activity`, () => {
	const [testActivity] = testActivity;
	const testActivityBody = testBody.filter(
		t => t.activity_id === testActivity.id
	);
	
	beforeEach("insert name, description", () => {
		return helpers.seedUsersActivityBody(
			db,
			testUsers,
			testActivity,
		
		);
	});
	
	it(`responds with 400 required error when 'name' or 'description' is missing`, () => {
		const postBody = {
			randomField: "test random field"
		};
		
		return supertest(app)
			.post(`/api/activity`)
			.set("Authorization", helpers.makeAuthHeader(testUser))
			.send(postBody)
			.expect(400, {
				error: `Missing 'name' or 'description' in request body`
			});
	});
	
	context(`Given incorrect `, () => {
		const incorrectPostBody = {
			guess: "incorrect"
		};
		
		it(`responds with 400 bad request`, () => {
			return supertest(app)
				.post(`/api/activity`)
				.set("Authorization", helpers.makeAuthHeader(testUser))
				.send(incorrectPostBody)
				.expect(200)
				.expect({
					name: testActivityBody[0].name,
					description: testActivityBody[0].description,
					
				});
		});
	
	context(`Given correct input`, () => {
		c
		
		it(`responds with correct and moves head`, () => {
			const correctPostBody = {
				name: testActivityBody[2].name,
				description: testActivityBody[2].description,
				
			};
			return supertest(app)
				.post(`/api/activity`)
				.set("Authorization", helpers.makeAuthHeader(testUser))
				.send(correctPostBody)
				.expect(200)
				.expect({
					name: testActivityBody[2].name,
					description: testActivityBody[2].description,
				});
		});
		
				});
		});
	});
});

