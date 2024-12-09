import React, { useState } from "react";
import { FiUserPlus, FiMessageSquare, FiLogOut } from "react-icons/fi";
import AddUserModal from "../board/AddUserModal";
import apiClient from "../../api/apiClient";

const Header = ({ onMessageClick, onLogout }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddUser = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAddUsersToBoard = async (selectedUsers, boardId) => {
    try {
      const users = selectedUsers.map((user) => user.id);
      const response = await apiClient.post(
        `${process.env.REACT_APP_BASE_URL}/api/board/users/${boardId}`,
        { users }
      );
    } catch (err) {}
  };

  return (
    <header className="bg-blue-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white text-blue-500 font-bold rounded-full h-10 w-10 flex items-center justify-center mr-2">
            K
          </div>
          <h1 className="text-xl font-semibold">Kanban</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div
            className="flex items-center cursor-pointer hover:text-blue-200"
            onClick={handleAddUser}
          >
            <FiUserPlus className="text-2xl mr-2" />
            <span className="hidden sm:inline">Add People</span>
          </div>
          <div
            className="flex items-center cursor-pointer hover:text-blue-200"
            onClick={onMessageClick}
          >
            <FiMessageSquare className="text-2xl mr-2" />
            <span className="hidden sm:inline">Messages</span>
          </div>
          <div
            className="flex items-center cursor-pointer hover:text-red-300"
            onClick={onLogout}
          >
            <FiLogOut className="text-2xl mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </div>
        </div>
      </div>
      <AddUserModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onAddUsers={handleAddUsersToBoard}
      />
    </header>
  );
};

export default Header;
