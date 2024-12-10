import React from "react";
import { Link } from "react-router-dom";
import { FiClipboard, FiUser, FiUserPlus } from "react-icons/fi";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-1">
      <section className="flex flex-col items-center justify-center bg-blue-500 text-white p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Welcome to Kanban Board
        </h1>
        <p className="text-base md:text-lg mb-8 text-center">
          Organize your projects and collaborate with your team seamlessly.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-white text-blue-500 rounded-md hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-500 transition"
          >
            Sign Up
          </Link>
        </div>
      </section>

      <section className="container mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border rounded shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-4">
              <FiClipboard className="text-3xl md:text-4xl text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold">
                Create Boards
              </h3>
            </div>
            <p className="mt-4 text-sm md:text-base">
              Easily create and manage your project boards to streamline your
              workflow.
            </p>
          </div>

          <div className="p-6 bg-white border rounded shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-4">
              <FiUser className="text-3xl md:text-4xl text-green-500" />
              <h3 className="text-lg md:text-xl font-semibold">
                Collaborate with Your Team
              </h3>
            </div>
            <p className="mt-4 text-sm md:text-base">
              Invite team members to boards and collaborate effectively.
            </p>
          </div>

          <div className="p-6 bg-white border rounded shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-4">
              <FiUserPlus className="text-3xl md:text-4xl text-purple-500" />
              <h3 className="text-lg md:text-xl font-semibold">Manage Tasks</h3>
            </div>
            <p className="mt-4 text-sm md:text-base">
              Keep track of tasks, assign roles, and set deadlines to stay
              organized.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-blue-500 text-white p-8 md:p-6 text-center h-36">
        <p className="text-sm md:text-base pt-24">
          &copy; 2024 Kanban Board. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
