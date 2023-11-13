const express = require("express");
const {open} = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const app = express();
app.user(express.json());
const bcrypt = express("bcrypt");

const databasePath = path.join(__dirname, "userData.db");

let database = null;

const initializeDbAndServer = async () => {
    try {
        database = await open({
            filename:databasePath,
            driver:sqlite3,Database,
        });
        app.listen(3000, () =>
        console.log("Server Running at http://localhost:3000/")
        );

    } catch (error) {
        console.log(`DB Error:${error message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

const validatePassword = (password) => {
    return password.length >4;
};

app.post("/register", async (request, response) => {
    const {username, name, password, gender, location} = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const postRegisterQuery = `
    SELECT 
    *
    FROM 
    user
    WHERE 
    username = ${username};`;
    const userDataBase = await database.get(postRegisterQuery);
    if(userDataBase === undefined) {
        const createUserQuery = `
        INSERT INTO 
        user(username, name, password, gender, location)
        VALUES 
        '${username}',
        '${name}'
        '${hashedPassword}',
        '${gender}',
        '${location}'
        );`;

        if (validatePassword(password)) {
            await database.run(createUserQuery);
            response.send("User Created Successfully");
        } else {
            response.status(400);
            response.send("Password is too short");
        } else {
            response.status(400);
            response.send("User already exists");
        }
    });

app.post("/login", async (request, response) => {
    const {username, password} = request.body;
    const postLoginQuery = `
    SELECT 
    *
    FROM 
    user
    WHERE 
    username = ${userName};`;
    const userDataBase = await database.get(postLoginQuery);
    if (userDatabase === undefined) {
        request.status(400);
        response.send("Invalid User");
    } else {
        const isPasswordMatched = await bcrypt.compare(
            password,
            userDataBase.password
        );

        if (isPasswordMatched === true) {
            response.send("Login Success!");

        } else {
            response.status(400);
            response.send("Invalid Password");
        }
    } 
});

app.put("/change-password", async (request, response) => {
    const {username, oldPassword, newPassword} = request.body;
    const putChangePasswordQuery = `
    SELECT 
    *
    FROM 
    user
    WHERE 
    username = ${userName};`;
    const userDataBase = await database.get(putChangePassword);

    if (userDatabase === undefined) {
        response.status(400);
        response.send("Invalid User");
    } else {
        const isPasswordMatched = await bcrypt.compar(
            oldPassword,
            userDatabase.password
        );

        if (isPasswordMatched === true) {
            if (validatePassword(newPassword)) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const updatePasswordQuery = `
                UPDATE 
                user 
                SET 
                password = '${hashedPassword}'
                WHERE 
                username = '${userName}';`;

                const user = await database.run(updatePasswordQuery);
                response.send("Password Updated");
            } else {
                response.status(400);
                response.send("Password is too short");
            } else {
                response.status(400);
                response.send("Invalid Current Password");
            }
        }
    

});

module.exports = app;





