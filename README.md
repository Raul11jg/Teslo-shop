# Next.js Tesla Shop  🛍️

Welcome to the Next.js Tesla Shop repository! This project aims to provide a web-based e-commerce platform for Tesla-related products built using Next.js.

## Tech Stack 🛠️

The project is built using the following technologies and tools:

- Next.js
- React
- MongoDB
- Mongoose
- NextAuth.js
- Material-UI
- Emotion
- Axios
- SWR
- TypeScript
- Docker
- Cloudinary

## Prerequisites ✅

Before running the project, make sure you have the following dependencies installed:

- Docker
- MongoDB

## Getting Started 🚀

Follow the steps below to set up and run the project locally:

### Setting up the Local Environment

1. Start the MongoDB database using Docker Compose. Run the following command:
`docker-compose up -d`

The `-d` flag detaches the containers, allowing them to run in the background.

2. Configure the environment variables:
- Rename the `.env.template` file to `.env`.
- Open the `.env` file and set the following variable:
  ```
  MONGO_URL=mongodb://localhost:27017/tesladb
  ```
  Make sure the MongoDB URL points to the correct database.

3. Seed the database with sample data. Make an API call to the following endpoint:
`http://localhost:3000/api/seed`

This will populate the database with test information.

### Running the Project

1. Install the project dependencies using your preferred package manager. For example, if you're using npm, run:
`npm install`


2. Start the development server. Run the following command:
`npm run dev`


3. Open your web browser and visit `http://localhost:3000` to access the Tesla Shop.



Please note that this directory structure assumes that the project follows common conventions and practices in a Next.js application.

If you have any questions or feedback, please don't hesitate to reach out. 




![image](https://github.com/Raul11jg/Teslo-shop/assets/46672868/0b6b1425-ff11-4d26-8818-edb0ec9195fc)
