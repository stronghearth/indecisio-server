BEGIN;

TRUNCATE
    app_user,
    activity;

-- admin123!

INSERT INTO app_user (name, username, password_hash) VALUES ('Quarantino Admin','admin','$2a$12$FS/uVNt/sT6SZ344UokyMuy04pE26.4aBco/DC31oMbHjCPxh1f2a' );
INSERT INTO activity (name, description) VALUES
('Pushups', 'Drop and give me 50'),
('Learn everything there is to know about the socratic paradox', 'This one should not take long at all');

SELECT setval('app_user_id_seq', (SELECT MAX(id) from app_user));
SELECT setval('activity_id_seq', (SELECT MAX(id) from activity));

COMMIT;