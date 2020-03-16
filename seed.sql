
truncate department;
INSERT department(name) values ("front-end");
INSERT department(name) values ("back-end");
INSERT department(name) values ("HR");
INSERT department(name) values ("Management");

truncate role;
insert role(title, salary, department_id) values ("Front-End Developer", 70000.00, 1);
insert role(title, salary, department_id) values ("UI Designer", 75000.00, 1);
insert role(title, salary, department_id) values ("Back-End Developer", 80000.00, 2);
insert role(title, salary, department_id) values ("Database Designer", 80000.00, 2);
insert role(title, salary, department_id) values ("HR Rep", 80000.00, 3);
insert role(title, salary, department_id)  values ("General Manager", 80000.00, 4);


truncate employee;
insert employee(first_name, last_name, role_id) values ("Nicholas", "Derissio", 6);
insert employee(first_name, last_name, role_id) values ("John", "Marston", 6);
insert employee(first_name, last_name, role_id, manager_id) values ("John", "Doe", 1, 1);
insert employee(first_name, last_name, role_id, manager_id) values ("Bill", "Mathison", 2, 2);

SELECT * FROM employee