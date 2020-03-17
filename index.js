const inquirer = require("inquirer");
const mysql = require("mysql");

setDBConnection = () => {
    return mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "nodeuser",
        password: "nodeuser",
        database: "employee_trackerdb"
    });
}


startQuestions = () => {

    let connection = setDBConnection();

    let choices = [ "View All Employees", "View All Employees by Department", "View All Employees by Manager", "Add Employee", "Update Employee Role", "Update Employee Managers"];

    inquirer.prompt(
        {
            type: "list",
            choices: choices,
            message: "What would you like to do?",
            name: "userChoice"
        }
    ).then(res => {

        handleSelection(res.userChoice, connection);

    });

}

handleSelection = (userChoice, connection) => {

    switch(userChoice){
        case "View All Employees":
            viewAllEmployees(connection);
            break;
        case "View All Employees by Department":
            viewEmployeeByDepartment(connection);
            break;
        case "View All Employees by Manager":
            viewEmployeeByManager(connection);
            break;
        case "Add Employee":
            addEmployee(connection);
            break;
        case "Update Employee Role":
            updateEmployeeRole(connection);
            break;
        case "Update Employee Managers":
            updateEmployeeManager(connection);
            break;
        default:
            console.log("Invalid Selection");
    }
}

viewAllEmployees = (connection) => {
    let query = "SELECT e.id AS e_id, CONCAT(e.first_name, ' ', e.last_name) AS e_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS m_name FROM employee AS e INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS m ON e.manager_id = m.id";
    handleGetConnection(connection, query);
}

viewEmployeeByDepartment = (connection) => {

    let query = "SELECT e.id AS e_id, CONCAT(e.first_name, ' ', e.last_name) AS e_name, d.name AS department FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id";
    handleGetConnection(connection, query);
}

viewEmployeeByManager = (connection) => {

    let query = "SELECT e.id AS e_id, CONCAT(e.first_name, ' ', e.last_name) AS e_name, CONCAT(m.first_name, ' ', m.last_name) AS m_name FROM employee AS e INNER JOIN employee AS m ON e.manager_id = m.id";
    handleGetConnection(connection, query);
}

addEmployee = (connection) => {

    let newEmployeeInfo = {};


    inquirer.prompt([
        {
            type: "input",
            message: "What is the employees First name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employees Last name?",
            name: "lastName"
        }
    ]).then(res => {

        newEmployeeInfo.firstName = res.firstName;
        newEmployeeInfo.lastName = res.lastName;

        connection.query("SELECT r.id AS r_id, r.title AS r_title FROM role AS r", (err, res) => {
            if(err)throw err;

            let role_list = [];

            res.forEach(e => role_list.push({id: e.r_id, name: e.r_title}));

            inquirer.prompt({
                type: "list",
                choices: role_list,
                message: "What is the employees role?",
                name: "newRole"
            }).then(res => {

                for(let i=0;i<role_list.length;i++){
                    if(role_list[i].name == res.newRole){
                        newEmployeeInfo.role = role_list[i];
                        break;
                    }
                }

                connection.query(`SELECT CONCAT(m.first_name, ' ', m.last_name) AS m_name, m.id AS m_id FROM employee AS m LEFT JOIN role ON role.id = m.role_id WHERE role.title = '${'General Manager'}'`, (err,res) => {
                    if(err) throw err;

                    let m_list = [];

                    res.forEach(e => m_list.push({id: e.m_id, name: e.m_name}));

                    inquirer.prompt({
                        type: "list",
                        choices: m_list,
                        message: "Which manager would you like to assign them to?",
                        name: "new_manager"
                    }).then(res => {

                        for(let i=0;i<m_list.length;i++){
                            if(m_list[i].name == res.new_manager){
                                newEmployeeInfo.manager_id = m_list[i].id;
                                break;
                            }
                        }

                        connection.query("INSERT INTO employee SET ?",[
                            {
                                first_name: newEmployeeInfo.firstName,
                                last_name: newEmployeeInfo.lastName,
                                role_id: newEmployeeInfo.role.id,
                                manager_id: newEmployeeInfo.manager_id
                            }
                        ], (err,res) => {
                            if(err)throw err;

                            console.log("Employee Added!");
                            viewAllEmployees(connection);

                        });
                        
                    });
                });
            });
        });
    });
}

updateEmployeeManager = (connection) => {

    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS e_name, e.id AS e_id FROM employee AS e", (err, res) => {
        if(err) throw err;

        let e_list = [];

        res.forEach(e => e_list.push({id: e.e_id, name: e.e_name}));


        let employeeToChange = "";

        inquirer.prompt({
            type: "list",
            choices: e_list,
            message: "Which employee' manager would you like to change?",
            name: "selected_employee"
        }).then(res => {

            employeeToChange = res.selected_employee;

            connection.query(`SELECT CONCAT(m.first_name, ' ', m.last_name) AS m_name, m.id AS m_id FROM employee AS m LEFT JOIN role ON role.id = m.role_id WHERE role.title = '${'General Manager'}' `, (err, res) => {
                if(err) throw err;

                let m_list = [];

                res.forEach(e => m_list.push({id: e.m_id, name: e.m_name}));

                inquirer.prompt({
                    type: "list",
                    choices: m_list,
                    message: "Which manager would you like to assign them to?",
                    name: "new_manager"
                }).then(res => {

                    let new_manager;
                    
                    m_list.forEach(e => {
                        if(e.name == res.new_manager){
                            new_manager = e;
                        }
                    });


                    connection.query(`UPDATE employee AS e, employee AS m SET e.manager_id = m.id WHERE CONCAT(e.first_name, ' ', e.last_name) = '${employeeToChange}' AND CONCAT(m.first_name, ' ', m.last_name) = '${new_manager.name}'`, (err,res) => {
                        if(err) throw err;
                        console.log("Manager updated!");
                        viewAllEmployees(connection);
                    });
                });
            });

        });

    });
}

updateEmployeeRole = (connection) => {

    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS e_name FROM employee AS e", (err, res) => {
        if(err)throw err;

        let e_list = [];

        res.forEach(e => e_list.push(e.e_name));

        inquirer.prompt({
            type: "list",
            choices: e_list,
            message: "Which employee' role would you like to change?",
            name: "employeeToChange"
        }).then(res => {

            let employeeToChange = res.employeeToChange;

            connection.query("SELECT r.title AS r_title, r.id AS r_id FROM role AS r", (err, res) => {
                if(err)throw err;

                let role_list = [];
                res.forEach(e => role_list.push({id: e.r_id, name: e.r_title}));

                inquirer.prompt({
                    type: "list",
                    choices: role_list,
                    message: "What is there new role?",
                    name: "newRole"
                }).then(res => {

                    role_list.forEach(e => {
                        if(e.name == res.newRole){
                            connection.query(`UPDATE employee AS e SET e.role_id = '${e.id}' WHERE CONCAT(e.first_name, ' ', e.last_name) = '${employeeToChange}'`, (err, res) => {
                                if(err)throw err;
                                console.log("Role Updated!");
                                viewAllEmployees(connection);
                            });
                        }
                    });
                });
            });
        });
    });

}

handleGetConnection = (connection, query) => {
    connection.query(query, (err, res) => {
        if(err) throw err;

        console.table(res);

        restartQuestions(connection);
    });
}

restartQuestions = (connection) =>{
    connection.end();
    startQuestions();
}

init = () => {
    startQuestions();

}

init();