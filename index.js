const inquirer = require("inquirer");
const mysql = require("mysql");

setDBConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        root: 'nodeuser',
        password: 'nodeuser',
        database: 'employee_trackerdb'
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

}

init = () => {
    startQuestions();

}

init();