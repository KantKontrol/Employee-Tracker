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

    let choices = [ "View All Employees", "View All Employees by Department", "View All Employees by Manager"];

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
        default:
            console.log("Invalid Selection");
    }

}

viewAllEmployees = (connection) => {
    connection.query("SELECT e.id AS e_id, CONCAT(e.first_name, ' ', e.last_name) AS e_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS m_name FROM employee AS e INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS m ON e.manager_id = m.id", (err,res) => {
        if(err) throw err;

        console.log(res);
    
        connection.end();
        startQuestions();
    });
}

init = () => {
    startQuestions();

}

init();