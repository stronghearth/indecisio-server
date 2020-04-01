CREATE TABLE activity(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_accepted BOOL DEFAULT '0',
    is_rejected BOOL DEFAULT '0' ,
    accepted_count INT DEFAULT 0,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator_id INTEGER REFERENCES app_user(id)
);