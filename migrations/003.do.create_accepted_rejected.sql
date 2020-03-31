CREATE TABLE accepted_rejected(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT REFERENCES app_user(id),
    activity INT REFERENCES activity(id),
    accepted BOOL DEFAULT '0',
    rejected BOOL DEFAULT '0'
);