BEGIN;

TRUNCATE
    app_user,
    activity,
    category,
    accepted_rejected
    RESTART IDENTITY CASCADE
    ;

-- admin123!
-- Password1!
INSERT INTO app_user (name, username, password_hash) 
VALUES 
    ('Quarantino Admin','admin','$2a$12$FS/uVNt/sT6SZ344UokyMuy04pE26.4aBco/DC31oMbHjCPxh1f2a'),
    ('Nicolas Cage', 'cage', '$2y$12$IMeZzb8OUUm4SuHYF2P/k.LeogJEbk.kvO44NZw0Th2y3YkGDoXIO'),
    ('Norm McNormalman', 'norm', '$2y$12$IMeZzb8OUUm4SuHYF2P/k.LeogJEbk.kvO44NZw0Th2y3YkGDoXIO');

INSERT INTO category (cat_name) 
VALUES 
    ('Entertainment'),
    ('Chores'),
    ('Learn'),
    ('Fitness'),
    ('Socialize');

INSERT INTO activity (name, description, creator_id, category_id) 
VALUES
    ('Pushups', 'Drop and give me 50', 1, 4),
    ('Learn everything there is to know about the socratic paradox', 'This one should not take long at all', 1, 3),
    ('Read "20,000 Leagues Under the Sea"', 'See you at Saturn', 1, 1),
    ('Do The Dishes', 'They are starting to smell!', 1, 2),
    ('Binge watch Ozark', 'It will make you want to move to Missouri and commit crimes', 1, 1),
    ('Go fishing with your friends', 'Just stay a pole''s distance from everyone', 2, 5),
    ('Act out your favorite Nic Cage scenes over Skype', 'A, B, C, D, E, F, G!!! HIJKLMNOP!!', 2, 5),
    ('Master JavaScript', 'This should take about two hours to complete.', 2, 3),
    ('Watch all the Ghost Rider movies back to back', 'What are you waiting for?', 2, 1),
    ('Watch all the National Treasure movies back to back', 'Cage is the true national treasure', 2, 1),
    ('Clean the shower', 'You were supposed to last week', 3, 2),
    ('Fold the laundry', 'Fold it, unfold it, then fold it again.  And you have to enjoy it.', 3, 2),
    ('Clean the floors with a toothbrush', 'Forrest Gump style', 3, 2);


SELECT setval('app_user_id_seq', (SELECT MAX(id) from app_user));
SELECT setval('activity_id_seq', (SELECT MAX(id) from activity));
SELECT setval('category_id_seq', (SELECT MAX(id) from category));
COMMIT;