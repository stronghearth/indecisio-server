CREATE TABLE accepted_rejected(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT REFERENCES app_user(id),
    activity INT REFERENCES activity(id),
    accepted_count INT DEFAULT 0,
    rejected_count INT DEFAULT 0
);