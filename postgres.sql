CREATE table employees(
id SERIAL PRIMARY KEY,
name VARCHAR(50),
email  VARCHAR(50),
salary INT,
department  VARCHAR(50),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (
name, email, salary, department
) VALUES
('Kamrul', 'kamrul@gmail.com', 22000, 'Math')
;

SELECT * FROM employees;

SELECT name, email FROM employees;

SELECT * FROM employees WHERE salary>=18000;

SELECT * FROM employees ORDER BY salary ASC;

SELECT * FROM employees ORDER BY salary DESC LIMIT 2;

UPDATE employees
SET department = 'Chemistry'
WHERE id = 3;

DELETE FROM employees
WHERE id = 4;

SELECT * from employees
WHERE department 
IN ('Bengali')

SELECT COUNT(*) from employees;

SELECT AVG(salary) FROM employees;

SELECT COUNT(name), department
FROM employees
GROUP BY department;

SELECT COUNT(name), department
FROM employees
GROUP BY department
HAVING COUNT(name)>2;

-- Table with constraints
CREATE table products(
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
price INT NOT NULL,
seller_id VARCHAR(25) UNIQUE,
in_stock BOOLEAN DEFAULT true   
);


-- FK
CREATE table users(
id SERIAL PRIMARY KEY,
name VARCHAR(50),
user_name VARCHAR(20),
email VARCHAR(40)
);


CREATE table orders(
id SERIAL PRIMARY KEY,
productName VARCHAR(100),
price INT,
qty INT,
ordered_by INT REFERENCES users(id)
);


SELECT 
    users.name AS user_name,
    (orders.price * orders.qty) AS order_amount
FROM orders
INNER JOIN users ON orders.ordered_by = users.id;















