# WuWu • Train booking website
[Try it out!](https://wuwu.leflon.fr)

![Cover Image](https://github.com/leflon/TI510M-Project/blob/mattelothere-readme-tweak/images/cover.png)
## Book a trip to paradise
Advanced Web Programming Project by **Mattéo Launay** & **Paul Leflon**
## Introduction
**WuWu** is a train booking system built for our *Advanced Web Programming* class at **Southeast University**. 

The trips booked on this website are obviously fake. 

This utilisizes all the topics we've learnt in this class, such as: 
 - Vue.js
 - Node.js
 - Express
 - MySql
 - Authentification

 ## How to run
 ### Clone this repository
 - Using Git CLI
 ```sh
 git clone https://github.com/paulleflon/TI510M-Project.git
 ```
 - Using GitHub CLI
 ```sh
gh repo clone paulleflon/TI510M-Project
 ```
### Install the necessary dependencies
You can simply run `npm install` from the root directory of the project. It will take care of installing the dependencies of both the frontend and the backend, while installing `concurrently`, use for a more seemless development experience.
```sh
npm install
```
### Set-up your MySQL Database
To function, this project requires a running MySQL server. Please make sure you have it installed on your computer. Then, you can initialize the database schemas and base data
```sh
cd backend
mysql -u <your_username> -p < db_init.sql # Initializes relations
mysql -u <your_username> -p WUWU < db_populate.sql # Populates the database with base data
```
Then you can also populate the database with dummy trips.
```sh
node makefakedata.js
```
**Please be aware that the execution of this script can take a long time and will fill a lot of data into MySQL.**
### Set environment variables
In both `frontend` and `backend` directories, you will find an `.env.example` file. Rename it to `.env` and fill in the variables. You can refer to the comments in the `.env.example` files to know what data to enter.
### Run the project locally
To run the project in dev conditions, you can go back to the root directory and run:
```sh
npm run dev
```
This will use `concurrently` to run both backend and frontend at the same time, hot reloading frontend thanks to `Vite` and the backend using `nodemon`.

If you wish to run the processes separately, you can run:
```sh
npm run frontend:dev
npm run backend:dev
```

# Authors
Project made by **Mattéo Launay** and **Paul Leflon**.

Class taught by **Chuhan Shi** and **Sixu Lu**.
