import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import PublicHome from "./components/PublicHome"; // New component for unauthenticated users
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Login from "./components/Login";
import Profile from "./components/Profile";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [taskTitle, setTaskTitle] = useState("Tasks");

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(data.user);
      } catch (error) {
        console.log("USER IS NOT AUTHENTICATED!");
        setIsAuthenticated(false);
        setUser({});
      }
    };
    handleGetUser();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <Navbar
          setTasks={setTasks}
          setIsAuthenticated={setIsAuthenticated}
          isAuthenticated={isAuthenticated}
          setTaskTitle={setTaskTitle}
        />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home
                  isAuthenticated={isAuthenticated}
                  tasks={tasks}
                  setTasks={setTasks}
                  taskTitle={taskTitle}
                />
              ) : (
                <PublicHome />
              )
            }
          />
          <Route
            path="/register"
            element={
              <Register
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )
            }
          />
          <Route
            path="/profile"
            element={<Profile user={user} isAuthenticated={isAuthenticated} />}
          />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
};

export default App;
