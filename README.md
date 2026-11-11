# Note-Taking App

A full-stack note-taking application built with **React, Node.js, Express.js, and MongoDB**.

The application allows users to securely register and log in, create personal notes, view their notes, edit them, and delete them. JWT authentication and user-based authorization ensure that users can only access their own notes.

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Create notes
- View personal notes
- Update notes
- Delete notes
- User-specific note authorization
- MongoDB database
- RESTful API
- Responsive React interface
- Loading and error states
- Protected API routes

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Project Structure

```text
Note-Taking-App/
│
├── client/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

### Notes

All note endpoints require a valid JWT token:

```text
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notes` | Create a note |
| GET | `/api/notes` | Get logged-in user's notes |
| GET | `/api/notes/:id` | Get a specific note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

## Security

- Passwords are hashed using bcrypt and are never stored as plain text.
- Authentication uses signed JWT tokens.
- Protected note routes require a valid JWT.
- Every note is associated with its owner.
- Users can only access their own notes.
- Users cannot update or delete another user's notes.
- Environment variables containing secrets are excluded from Git.

## Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd Note-Taking-App
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a file:

```text
server/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Do not commit the `.env` file to GitHub.

### 4. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Open the Vite development URL shown in the terminal.

## Authentication Flow

1. User registers with name, email, and password.
2. The password is securely hashed using bcrypt.
3. User information is stored in MongoDB.
4. The server generates a JWT token.
5. The frontend stores the authentication token.
6. Protected note requests send the JWT using the Authorization header.
7. The backend verifies the JWT.
8. The authenticated user's ID is obtained from the token.
9. Notes are queried using that user ID.
10. This prevents users from accessing other users' notes.

## Note Management

Logged-in users can:

- Create new notes
- View all of their notes
- View an individual note
- Edit existing notes
- Delete notes
- Refresh their notes
- Log out securely

## Testing

The backend API was tested using `curl`.

The following functionality was verified:

- User registration
- User login
- JWT authentication
- Note creation
- Note retrieval
- Note update
- Note deletion
- Protected note access

## Author

**Munna Pandey**

B.Tech CSE - Artificial Intelligence & Machine Learning