import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthToken } from "../api/apiClient";

const AuthForm = ({ mode }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "register") {
      if (/\s/.test(formData.username)) {
        setError("Username should not contain spaces.");
        return;
      }
    }

    setError("");

    const endpoint =
      mode === "login"
        ? `${process.env.REACT_APP_BASE_URL}/api/auth/login`
        : `${process.env.REACT_APP_BASE_URL}/api/auth/register`;

    try {
      const response = await axios.post(endpoint, formData);

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setAuthToken(data.token);
          navigate("/kanban");
        } else {
          alert("Authentication failed");
        }
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else if (error.request) {
        setError("No response from the server. Please try again later.");
      } else {
        setError("Error setting up request. Please try again later.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
      <div className="mt-4 text-center">
        {mode === "login" ? (
          <p className="text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline"
            >
              Signup
            </button>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
