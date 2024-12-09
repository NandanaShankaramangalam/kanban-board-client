import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import apiClient from "../../api/apiClient";

const Addtask = ({ socket, setNewTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const url = window.location.href;
  const boardId = url.split("/").pop();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await apiClient.post(
        `${process.env.REACT_APP_BASE_URL}/api/board/${boardId}/add-task`,
        newTask
      );
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  return (
    <div className="mt-2">
      <button
        className="bg-blue-500 ms-4 text-white px-4 py-2 rounded shadow cursor-pointer"
        onClick={handleOpenModal}
      >
        + Create Task
      </button>
      {isModalOpen && (
        <AddTaskModal
          socket={socket}
          onClose={handleCloseModal}
          setNewTask={setNewTask}
          handleAddTask={handleAddTask}
        />
      )}
    </div>
  );
};

export default Addtask;
