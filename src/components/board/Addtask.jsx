import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import apiClient from "../../api/apiClient";
import { getSelectedBoardInfo } from "../../utils/utils";

const Addtask = ({ socket, setNewTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const url = window.location.href;
  //   const boardId = url.split("/").pop();
  const boardInfo = getSelectedBoardInfo();
  const boardId = boardInfo?.id;

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
    <div className="mt-2 flex justify-between items-center">
      <button
        className="bg-blue-500 ms-4 text-white px-4 py-2 rounded shadow cursor-pointer"
        onClick={handleOpenModal}
      >
        + Create Task
      </button>
      {boardInfo?.name && (
        <div className="mb-2 me-4">
          <span className="bg-blue-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
          {boardInfo?.name}
          </span>
        </div>
      )}
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
