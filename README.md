# GlobalTNA Service Request Board

A full-stack application with a React/Next.js frontend and an Express/Node.js backend.

## Project Structure

- `/frontend` - Next.js React application
- `/backend` - Node.js Express REST API

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables (see below).
4. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Required Environment Variables

Create a `.env` file in the `backend/` directory. You can use the provided `backend/.env.example` as a template.

**`backend/.env`**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/globaltna
# For MongoDB Atlas use:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/globaltna
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

*(No additional environment variables are currently required for the frontend)*

## Run Instructions

You will need to open two separate terminal windows or tabs to run the frontend and backend servers concurrently.

### Running the Backend

In the first terminal:
```bash
cd backend

# For development with auto-reloading (nodemon):
npm run dev

# Or for a standard start:
npm start
```
The backend API will run on `http://localhost:5000`.

### Running the Frontend

In the second terminal:
```bash
cd frontend

# Start the Next.js development server:
npm run dev
```
The frontend application will run on `http://localhost:3000`.

## Testing

To run the backend test suite:
```bash
cd backend
npm test
```
