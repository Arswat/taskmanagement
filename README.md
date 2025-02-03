# Task Management App
A responsive and feature-rich task management application built using React (TypeScript), Redux, Firebase Authentication, and Express.js with MongoDB. The app allows users to efficiently create, organize, and track their tasks with features like sorting, filtering, and task categorization.

Instructions to run the Application :

**Ensure you have the following installed:**

Node.js (v16 or later)
MongoDB (running locally or MongoDB Atlas)

**Clone the repository**

git clone https://github.com/yourusername/task-management-app.git
cd task-management-app

**Install dependencies**

cd frontend
npm install

cd backend
npm install

**Set Up Firebase Authentication**

Go to Firebase Console.
Create a new project and enable Google Sign-In under Authentication.
Copy the Firebase config credentials and create a .env file in the frontend directory with:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

**Configure MongoDB Database**

If using MongoDB Atlas, create a database cluster and whitelist your IP.
Create a .env file in the backend directory with:

MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/taskDB
PORT=5000

cd backend
npm run dev

cd frontend
npm start

**Implemented Features**
✅ User Authentication (Firebase)
Google Sign-In and Logout
User Profile Management
✅ Task Management
Create, Edit, Delete tasks
Attach files to tasks
Categorization (Work, Personal, etc.)
Set Due Dates
✅ Task Filtering & Sorting
Filter by category, status, and due date
Sort tasks by due date (Ascending/Descending)
Search tasks by title
✅ Batch Actions
Select multiple tasks and delete them
Change status for multiple tasks at once
✅ Responsive Design
Built with React-Bootstrap for a clean UI

**🛠 Challenges Faced & Solutions Implemented**

1️⃣ Firebase Authentication in Redux
Challenge: Managing user state in Redux without causing re-renders.
Solution: Used useEffect in the AuthContext to persist the user session.
2️⃣ Drag-and-Drop Not Working
Challenge: react-beautiful-dnd threw errors like "Cannot find droppable entry".
3️⃣ Database & API Integration
Challenge: Ensuring real-time updates between MongoDB and Redux state.
Solution: Used Redux Toolkit with createAsyncThunk for seamless API integration.
 
