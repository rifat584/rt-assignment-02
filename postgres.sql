-- Task 1: Create a database named company_db
CREATE DATABASE company_db;


-- Task 2: Create a table named employees
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(50),
  salary INT,
  department VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Task 3: Insert at least 5 employees into the employees table
INSERT INTO employees (name, email, salary, department)
VALUES
('Kamrul', 'kamrul@gmail.com', 22000, 'IT'),
('Naim', 'naim@gmail.com', 30000, 'IT'),
('Rahim', 'rahim@gmail.com', 45000, 'HR'),
('Karim', 'karim@gmail.com', 55000, 'Finance'),
('Hasan', 'hasan@gmail.com', 65000, 'IT'),
('Sakib', 'sakib@gmail.com', 42000, 'HR'),
('Mitu', 'mitu@gmail.com', 48000, 'IT');


-- Task 4: Select all data
SELECT * FROM employees;


-- Task 5: Select specific columns
SELECT name, salary FROM employees;


-- Task 6: Use WHERE condition
SELECT * FROM employees
WHERE salary > 40000;


-- Task 7: Use ORDER BY
SELECT * FROM employees
ORDER BY salary DESC;


-- Task 8: Use LIMIT
SELECT * FROM employees
ORDER BY salary DESC
LIMIT 3;


-- Task 9: Update data
UPDATE employees
SET salary = salary + 5000
WHERE id = 1;


-- Task 10: Delete data
DELETE FROM employees
WHERE id = 4;


-- Task 11: Use BETWEEN
SELECT * FROM employees
WHERE salary BETWEEN 30000 AND 60000;


-- Task 12: Use IN
SELECT * FROM employees
WHERE department IN ('IT', 'HR');


-- Task 13: Use COUNT
SELECT COUNT(*) AS total_employees
FROM employees;


-- Task 14: Use AVG
SELECT AVG(salary) AS average_salary
FROM employees;


-- Task 15: Use GROUP BY
SELECT department, COUNT(*) AS total_employees
FROM employees
GROUP BY department;


-- Task 16: Use HAVING
SELECT department, COUNT(*) AS total_employees
FROM employees
GROUP BY department
HAVING COUNT(*) > 2;


-- Task 17: Add constraints
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  seller_id VARCHAR(25) UNIQUE,
  in_stock BOOLEAN DEFAULT true
);


-- Task 19: Create users table for foreign key relation
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  user_name VARCHAR(20),
  email VARCHAR(40)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(100),
  price INT,
  qty INT,
  ordered_by INT REFERENCES users(id)
);



-- Task 20: Use INNER JOIN
SELECT 
  users.name AS user_name,
  (orders.price * orders.qty) AS order_amount
FROM orders
INNER JOIN users
ON orders.ordered_by = users.id;
