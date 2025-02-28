# News Structure Portfolio

This project is a news structure portfolio built using JavaScript. It connects to a PostgreSQL database using `pg` and utilizes raw SQL queries to create and insert data into tables.

## Table of Contents

- [Installation](#installation)
- [Setting Up Environment Variables](#setting-up-environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [License](#license)

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

1. Clone this repository:

   ```sh
   git clone https://github.com/your-username/news-structure-portfolio.git
   cd news-structure-portfolio
   ```


2. Install dependencies:

```sh
    npm install
  ```

## Setting Up Environment Variables

To connect to your PostgreSQL database locally, you need to create a .env file in the root directory with the following variables:

 1. Create a `.env.developement` and `.env.test` file in the project root:

    ```sh
    touch .env.development && touch .env.test
    ```

2. Add the database name to the `.env.development` and `.env.test` file:

    In the `.env.developement`:
    ```sh
        PGDATABASE = <your_database_name>
        
    ```
    In the `.env.test`:
    ```sh
        PGDATABASE = <your_database_name>.test
        
    ```

## Database Setup

1. Ensure PostgreSQL is running on your system.

2. Run the following command to create the database tables:
    ```sh
    npm run setup-dbs
    ```
3. Run the following command to insert initial data (optional):

    ```sh
    npm run seed-dev
    ```

## Running the Project

To start the application:

```sh
npm start
```
For development mode with live reloading:
```sh
npm run dev
```
To run tests:
```sh
npm test
```
## Testing

This project uses Jest as the testing framework. To run tests, use the following command:

```sh
npm test
```
To test the database seed script:
```sh
npm run test-seed
```
Jest is configured with jest-extended for additional matchers. The Jest configuration can be found in the package.json under the jest section.

##  License

This project is licensed under the license that I don't know
