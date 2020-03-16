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

    let choices = [ "View All Employees", "View All Employees by Department", "View All Employees by Manager", "Update Employee Managers"];

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

updateEmployeeManager = (connection) => {

    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS e_name FROM employee AS e", (err, res) => {
        if(err) throw err;

        let e_list = [];

        res.forEach(e => {
            e_list.push(e.e_name);
        });

        let employeeToChange = "";

        inquirer.prompt({
            type: "list",
            choices: e_list,
            message: "Which employee' manager would you like to change?",
            name: "selected_employee"
        }).then(res => {

            employeeToChange = res.selected_employee;

            connection.query("SELECT DISTINCT CONCAT(m.first_name, ' ', m.last_name) AS m_name FROM employee AS m RIGHT JOIN employee AS e ON m.id = e.manager_id WHERE CONCAT(m.first_name, ' ', m.last_name) is not null", (err, res) => {
                if(err) throw err;

                console.log(res);
            })

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