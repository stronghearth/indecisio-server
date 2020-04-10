# Indecisio Server

## Team
- Blade Boles
- Taylor Bradshaw
- William MacNeil

## Link to Client Repo

- https://github.com/thinkful-ei-jaguar/indecisio-client

# API Endpoints

**User Router**
----
  _Requests to this endpoint allows a user to create an account that can be saved in the database._

* **URL**

  _/api/user_

* **Method:**

   `POST` 

* **Data Params**

  _name : ex => Quarantino Admin_

  _username : ex => admin_

  _password : ex => Password1!_

* **Sample JSON Request Body:**

    `{ 'name' : 'Quarantino Admin', 'username' : 'admin', 'password' : 'Password1!' }`

* **Success Response:**
  
  _A success response sends a URL location for the new user as well as a serialized JSON object containing the user's information (except the password)._

  * **Code:** 201 <br />
    **Content:** `{ 'id': 1, 'name' : 'Quarantino Admin', 'username' : 'admin'}`
    
    **URL Location** `baseUrl/user.id`
 
* **Error Response:**

  _Error responses occur when data params are missing, the username exists in the database already, or the password doesn't meet the requirements._

  * **Code:** 400 BAD REQUEST <br />
        **Content:** `{ 'error' : 'Password must be longer than 8 characters'} OR 'error' : 'Password must be less than 72 characters' OR 'error' : 'Password must not start or end with empty spaces' OR 'error' : 'Password must contain one upper case, lower case, number and special character' }`
                
  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ 'error' : 'Username already taken' }`

  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ 'error' : 'Missing [name, username or password] in request body' }`

**Authorization Router**
----
  _Requests to this endpoint authorizes existing valid users to log in and access additional endpoints._

* **URL**

  _/api/auth/token_

* **Method:**

   `POST` | `PUT`

* **Data Params**

  _username : ex => admin_

  _password : ex => Password1!_

* **Sample JSON Request Body:**

  `{ 'username' : 'admin', 'password' : 'Password1!' }`

* **Success Response:**
  
  _Successful POST Returns 200 with a JWT authorization token._

  * **Code:** 200 <br />
    **Content:** `{ 'authToken' : '$2a$12$FS/uVNt/sT6SZ344UokyMuy04pE26.4aBco/DC31oMbHjCPxh1f2a' }`
 
* **Error Response:**

  _400 errors occcur when data params are missing, the username doesn't exist, or password is incorrect for the username._

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ 'error' : 'Missing [username or password] in request body' }`

  OR

  * **Code:** 400 BAD REQUEST<br />
    **Content:** `{ 'error' : 'Incorrect username or password' }`

**Activity Router -> All Activities**
----
  _Requests to this endpoint handles the requests for retrieving all activities and adding a new activity to the system._

* **URL**

  _/api/activity_

* **Method:**

   `GET` | `POST`

* **Data Params for POST**

  _name : ex => Do the dishes!_

  _description : ex => You know they're piling up_

  _category_id: ex => 1 (referncing a specific category ie Entertainment)_

  _creator_id: ex => 2 (referencing a logged in user that is submitting new activity)_

* **Sample JSON Request Body for POST:**

  `{ 'name' : 'Do the dishes!', 'description' : 'You know they're piling up', 'category_id': '1', 'creator_id': '2' }`

* **Success Response:**
  
  _Successful GET Returns 200 with an array of all activities in the database sorted by date created in descending order_

  * **Code:** 200 <br />
    **Content:** `[{
        "id": 10,
        "name": "Watch all the National Treasure movies back to back",
        "category_id": "1",
        "description": "Cage is the true national treasure",
        "is_accepted": true,
        "is_rejected": false
    },
    {
        "id": 4,
        "name": "Do The Dishes",
        "category_id": "2",
        "description": "They are starting to smell!",
        "is_accepted": true,
        "is_rejected": false
    },
    {
        "id": 12,
        "name": "Fold the laundry",
        "category_id": "2",
        "description": "Fold it, unfold it, then fold it again.  And you have to enjoy it.",
        "is_accepted": false,
        "is_rejected": true
    },
    {
        "id": 9,
        "name": "Watch all the Ghost Rider movies back to back",
        "category_id": "1",
        "description": "What are you waiting for?",
        "is_accepted": true,
        "is_rejected": false
    }
]`

  _Successful POST Returns 201 with JSON object containing new activity's information_

* **Code:** 201 <br />
    **Content:** `{ 'name' : 'Do the dishes!', 'description' : 'You know they're piling up', 'category_id': '1', 'creator_id': '2', 'is_accepted':'false', 'is_rejected': 'false' }`
 
* **Error Response:**

  _401 errors occcur when user tries to make a GET or POST request without authorization._

  * **Code:** 401 UNAUTHORIZED<br />
    **Content:** `{ 'error' : 'Missing bearer token' }`

  OR

  _400 errors occcur for POST requests when one of the data params is missing._

  * **Code:** 400 BAD REQUEST<br />
    **Content:** `{ 'error' : 'Missing [data param] in request body' }`

**Activity Router -> Individual Activity**
----
  _Requests to this endpoint retrieves, updates, and deletes an individual activity in the database._

* **URL**

  _/api/activity/:activity_id_

* **Method:**

   `GET` | `PATCH` | `DELETE` 

*  **URL Params**

   **Required:**
 
   `id` => _integer referencing activity's unique ID number in database_

* **Data Params for PATCH**

    _Only one of these is required along with the activity id in order to make a successful request_

    _name : ex => Do the dishes!_

    _description : ex => You know they're piling up_

    _is_accepted: true or false depending on action taken by user_

    _is_rejected: true or false depending on action taken by user_


* **Sample JSON Request Body for PATCH:**

    `{ 'name' : 'Do the dishes!', 'description' : 'You know they're piling up', 'is_accepted':'true', 'is_rejected': 'false' }`
    
* **Success Response:**
  
  _A successful GET response returns 200 and a single object an activity's information based on id provided._

  * **Code:** 200 <br />
    **Content:** `{
        "id": 1,
        "name": "Pushups",
        "category_id": "4",
        "description": "Drop and give me 50",
        "is_accepted": true,
        "is_rejected": false
    }`
 
  _A successful DELETE and PATCH response returns 204 and promise ends._

* **Error Response:**

   _401 errors occcur when user tries to make a GET, DELETE or POST request without authorization._

  * **Code:** 401 UNAUTHORIZED<br />
    **Content:** `{ 'error' : 'Missing bearer token' }`
                
    _400 errors occcur when user tries to make a POST request without any data params._

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ 'error' : 'Request body must contain at least one of the following keys: 'name', 'description', 'is_accepted', 'is_rejected'' }`

**Categories Router**
----
  _Requests to this endpoint retrieves all activity categories or all activities attached to a particular category_

* **URL**

  _/api/categories_

  OR

  _/api/:cat_name_

* **Method:**

   `GET` 

* **URL Params for Single Category**

  `/cat_name` refernces name of category

  Example `/Learn` (uppercase needed)

* **Success Response:**
  
  _A successful GET /categories request returns an array of all categories in the database._

  * **Code:** 200 <br />
    **Content:** `[
            {
                "id": 1,
                "cat_name": "Entertainment"
            },
            {
                "id": 2,
                "cat_name": "Chores"
            },
            {
                "id": 3,
                "cat_name": "Learn"
            },
            {
                "id": 4,
                "cat_name": "Fitness"
            },
            {
                "id": 5,
                "cat_name": "Socialize"
            }
        ]`

    _A successful GET /categories/:cat_name request returns an array of all activities in that category._
    
    * **Code:** 201 <br />
    **Content:** `[
        {
            "id": 2,
            "name": "Learn everything there is to know about the socratic paradox",
            "description": "This one should not take long at all",
            "is_accepted": false,
            "is_rejected": true,
            "global_accepted_count": 1,
            "date_created": "2020-04-06T17:20:01.362Z",
            "creator_id": 1,
            "category_id": 3
        },
        {
            "id": 24,
            "name": "Bake some bread",
            "description": "Make it from scratch or else!",
            "is_accepted": true,
            "is_rejected": false,
            "global_accepted_count": 1,
            "date_created": "2020-04-06T22:48:47.721Z",
            "creator_id": 1,
            "category_id": 3
        },
        ...
    ]`

* **Error Response:**

  _401 errors occcur when user tries to make either GET request without authorization._

  * **Code:** 401 UNAUTHORIZED<br />
    **Content:** `{ 'error' : 'Missing bearer token' }`
                
**Profile Router**
----
  _Requests to this endpoint retrieves the activities with the highest acceptance counts and filters activities by the creator_id._

* **URL**

  _/api/profile/mostpopular_

  _/api/profile/user_

  _/api/profile/notglobal_

  _/api/profile/notglobal/:category_name_

* **Method:**

   `GET` | `POST` 

* **URL Params**

  _POST /api/profile/notglobal/:category_name_

  _/:category_name => refernces name of category_

  _Example `/Learn` (uppercase needed)_

* **Success Response:**
  
  _A successful GET /mostpopular response returns an array of 10 most often accepted activity suggestions accross all users._

  * **Code:** 200 <br />
    **Content:** `[
        {
            "name": "Fold the laundry",
            "global_accepted_count": 6,
            "description": "Fold it, unfold it, then fold it again.  And you have to enjoy it.",
            "username": "norm"
        },
        {
            "name": "Master JavaScript",
            "global_accepted_count": 6,
            "description": "This should take about two hours to complete.",
            "username": "cage"
        },
        {
            "name": "Watch all the Ghost Rider movies back to back",
            "global_accepted_count": 4,
            "description": "What are you waiting for?",
            "username": "cage"
        },
        {
            "name": "Watch all the National Treasure movies back to back",
            "global_accepted_count": 3,
            "description": "Cage is the true national treasure",
            "username": "cage"
        },
        {
            "name": "Act out your favorite Nic Cage scenes over Skype",
            "global_accepted_count": 2,
            "description": "A, B, C, D, E, F, G!!! HIJKLMNOP!!",
            "username": "cage"
        },
        {
            "name": "Aminal Cwossing",
            "global_accepted_count": 2,
            "description": "get deh game meow",
            "username": "admin"
        },
        {
            "name": "Clean the floors with a toothbrush",
            "global_accepted_count": 2,
            "description": "Forrest Gump style",
            "username": "norm"
        },
        {
            "name": "Do The Dishes",
            "global_accepted_count": 2,
            "description": "They are starting to smell!",
            "username": "admin"
        },
        {
            "name": "Go fishing with your friends",
            "global_accepted_count": 2,
            "description": "Just stay a pole's distance from everyone",
            "username": "cage"
        },
        {
            "name": "HELP",
            "global_accepted_count": 2,
            "description": "I NEED SOMEBODY!",
            "username": "admin"
        }
    ]`
    
  _A successful GET /user response returns an array of 10 most often accepted activity suggestions by an individual user.

     * **Code:** 200 <br />
    **Content:** `[
            {
                "name": "Act out your favorite Nic Cage scenes over Skype",
                "accepted_count": 2,
                "description": "A, B, C, D, E, F, G!!! HIJKLMNOP!!",
                "username": "cage"
            },
            {
                "name": "Aminal Cwossing",
                "accepted_count": 2,
                "description": "get deh game meow",
                "username": "admin"
            },
            {
                "name": "HELP",
                "accepted_count": 2,
                "description": "I NEED SOMEBODY!",
                "username": "admin"
            },
            {
                "name": "Jump Around",
                "accepted_count": 2,
                "description": "JUMP JUMP JUMP JUMP JUMP JUMP",
                "username": "admin"
            },
            {
                "name": "Master JavaScript",
                "accepted_count": 2,
                "description": "This should take about two hours to complete.",
                "username": "cage"
            },
            {
                "name": "poorly",
                "accepted_count": 2,
                "description": "This is the knight from Indiana Jones and the Last Crusade letting you know...",
                "username": "admin"
            },
            {
                "name": "Bake some bread",
                "accepted_count": 1,
                "description": "Make it from scratch or else!",
                "username": "admin"
            },
            {
                "name": "Clean the floors with a toothbrush",
                "accepted_count": 1,
                "description": "Forrest Gump style",
                "username": "norm"
            },
            {
                "name": "Do The Dishes",
                "accepted_count": 1,
                "description": "They are starting to smell!",
                "username": "admin"
            },
            {
                "name": "Fold the laundry",
                "accepted_count": 1,
                "description": "Fold it, unfold it, then fold it again.  And you have to enjoy it.",
                "username": "norm"
            }
        ]`

  _A successful POST /notglobal response returns an array of activities created by the logged in user._

    * **Code:** 200 <br />
    **Content:** `[
      {
          "id": 1,
          "name": "Pushups",
          "description": "Drop and give me 50",
          "is_accepted": true,
          "is_rejected": false,
          "global_accepted_count": 1,
          "date_created": "2020-04-06T17:20:01.362Z",
          "creator_id": 1,
          "category_id": 4
      },
      {
          "id": 2,
          "name": "Learn everything there is to know about the socratic paradox",
          "description": "This one should not take long at all",
          "is_accepted": false,
          "is_rejected": true,
          "global_accepted_count": 1,
          "date_created": "2020-04-06T17:20:01.362Z",
          "creator_id": 1,
          "category_id": 3
      },
      {
          "id": 3,
          "name": "Read \"20,000 Leagues Under the Sea\"",
          "description": "See you at Saturn",
          "is_accepted": false,
          "is_rejected": true,
          "global_accepted_count": 1,
          "date_created": "2020-04-06T17:20:01.362Z",
          "creator_id": 1,
          "category_id": 1
      },
      ...
      ]`

    _A successful POST /notglobal/:category_name response returns an array of activities filtered by a logged in user's id and by a category._

     * **Code:** 200 <br />
    **Content:** `[{
            "id": 2,
            "name": "Learn everything there is to know about the socratic paradox",
            "description": "This one should not take long at all",
            "is_accepted": false,
            "is_rejected": true,
            "global_accepted_count": 1,
            "date_created": "2020-04-06T17:20:01.362Z",
            "creator_id": 1,
            "category_id": 3
        },
        {
            "id": 22,
            "name": "wisely",
            "description": "This is the knight from Indiana Jones and the Last Crusade letting you know...",
            "is_accepted": true,
            "is_rejected": false,
            "global_accepted_count": 1,
            "date_created": "2020-04-06T22:19:49.494Z",
            "creator_id": 1,
            "category_id": 3
        },
        {
            "id": 21,
            "name": "poorly",
            "description": "This is the knight from Indiana Jones and the Last Crusade letting you know...",
            "is_accepted": true,
            "is_rejected": false,
            "global_accepted_count": 2,
            "date_created": "2020-04-06T22:19:30.964Z",
            "creator_id": 1,
            "category_id": 3
        },
        ...
        ]`
 
* **Error Response:**

    _401 errors occcur when user tries to make a GET /user or POST /notglobal and /notglobal/:category_name request without authorization._

  * **Code:** 401 UNAUTHORIZED<br />
    **Content:** `{ 'error' : 'Missing bearer token' }`

# Get Started 
## Clone Our Repository

### Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone INDECISIO-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Create an .env file containing local variables such as postgres database URLs and the default PORT the server should be listening on.
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "indedisio-server",`

## Express Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

