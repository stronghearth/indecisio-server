CREATE TABLE category(
   id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   cat_name VARCHAR(50)
);

ALTER TABLE activity
    ADD COLUMN
        category_id INT REFERENCES category(id)
        ON DELETE SET NULL;