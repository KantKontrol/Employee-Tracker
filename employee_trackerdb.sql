DROP DATABASE IF EXISTS employee_trackerdb;

CREATE DATABASE employee_trackerdb;

USE employee_trackerdb;

CREATE TABLE department (
	id INT auto_increment NOT NULL,
    name VARCHAR(30),
    primary key (id)
);

CREATE TABLE role (
	id INT NOT NULL auto_increment,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    primary key (id)
);

CREATE TABLE employee (
	id INT NOT NULL auto_increment,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    primary key (id)
);

SELECT department.id FROM department INNER JOIN role ON role.department_id=department.id;

SELECT role.id FROM role INNER JOIN employee ON employee.role_id=role.id;

USE employee_trackerdb;

SELECT e.id AS e_id, CONCAT(e.first_name, " ", e.last_name) AS e_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(m.first_name, " ", m.last_name) AS m_name
FROM employee AS e INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS m ON e.manager_id = m.id;

SELECT e.first_name AS e_firstname, e.last_name AS e_lastname,
 m.first_name AS m_firstname, m.last_name AS m_lastname
FROM employee AS e INNER JOIN employee AS m
ON e.manager_id = m.role_id;

