BEGIN;

TRUNCATE
    "app_user",
    "activity";

-- admin123!

INSERT INTO app_user (id, name, username, password_hash) VALUES ('1', 'Quarantino Admin','admin','$2a$12$FS/uVNt/sT6SZ344UokyMuy04pE26.4aBco/DC31oMbHjCPxh1f2a' );
INSERT INTO activity (name, description, isAccepted, isRejected) VALUES 
('Pushups', 'Drop and give me 50', '1','1'),
('Learn everything there is to know about the socratic paradox', 'This one shouldnt take long at all','1','1');

SELECT setval('app_user_id_seq', (SELECT MAX(id) from "app_user"));
SELECT setval('activity_id_seq', (SELECT MAX(id) from "activity"));

COMMIT;