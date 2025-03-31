# News Structure Portfolio

This project is a backend API for a news platform, providing RESTful endpoints to interact with a PostgreSQL database. It allows users to fetch topics, articles, users, and comments, as well as post, update, and delete comments and articles.

## Hosted Version

You can access the hosted API here: [NC News API](https://nc-news-soqt.onrender.com/)

## Features

- Fetch a list of articles, topics, users, and comments
- Query articles by author, topic, sort order, and pagination
- Post new articles and comments
- Update votes for articles and comments
- Delete comments and articles


## Table of Contents

- [Installation](#installation)
- [Setting Up Environment Variables](#setting-up-environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Testing](#testing)

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
For development mode with live reloading (working on it):
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

