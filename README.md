# Tiny Chat

Tiny chat is a real-time room based chat application.

## Technology

Backend: Node, Express, Socket.IO

Frontend: React, Chakra UI

Language: Typescript

## Running Locally

1. Install prerequisites: Node, MongoDB
2. Clone repository
3. Run npm install in both backend & frontend folders
4. Make an .env file in the backend folder root and make the following entries:
   DB_CONNECTION_STRING=mongodb connection string here

   PORT=3001

   JWT_SECRET=any string
5. Make an .env file in the frontend folder root and make the following entries:
   REACT_APP_BACKEND_URL=http://localhost:3001/
6. Run npm run start in frontend folder and npm run dev in backend folder
7. Navigate to localhost:3001 in a browser

## Screenshots

[![screenshot_1](https://i.imgur.com/C5OFZpN.png)

[![screenshot_1](https://i.imgur.com/3L4gMb5.png)

[![screenshot_1](https://i.imgur.com/uPnlGds.png)
