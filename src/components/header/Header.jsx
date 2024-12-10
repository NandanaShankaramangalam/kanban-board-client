import React, { useEffect, useState } from "react";
import {
  FiUserPlus,
  FiMessageSquare,
  FiLogOut,
  FiClipboard,
  FiUserMinus,
  FiGrid,
  FiUser,
} from "react-icons/fi";
import AddUserModal from "../board/AddUserModal";
import apiClient from "../../api/apiClient";
import { useLocation, useNavigate } from "react-router-dom";
import { getSelectedBoardInfo, isLoggedIn } from "../../utils/utils";
import RemoveUserModal from "../board/RemoveUserModal";

const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [isBoardView, setIsBoardView] = useState(false);
  const [isMessagesView, setIsMessagesView] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const selectedBoard = JSON.parse(localStorage.getItem("selectedBoard"));
  const boardInfo = getSelectedBoardInfo();
  const boardId = boardInfo?.id;

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/kanban/board/") && !path.includes("/messages")) {
      setIsBoardView(true);
      setIsMessagesView(false);
    } else if (path.includes("/kanban/messages/")) {
      setIsMessagesView(true);
      setIsBoardView(false);
    } else {
      setIsBoardView(false);
      setIsMessagesView(false);
    }
  }, [location.pathname]);

  const handleAddUser = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const handleRemoveUsers = () => setIsRemoveModalVisible(true);
  const handleCloseRemoveUserModal = () => setIsRemoveModalVisible(false);

  const handleAddUsersToBoard = async (selectedUsers, boardId) => {
    try {
      const users = selectedUsers.map((user) => user.id);
      const response = await apiClient.post(
        `${process.env.REACT_APP_BASE_URL}/api/board/add-users/${boardId}`,
        { users }
      );
    } catch (err) {}
  };

  const handleRemoveUsersFromBoard = async (selectedUsers, boardId) => {
    try {
      const users = selectedUsers.map((user) => user.id);
      console.log("users for remove?????????? ", users);
      const response = await apiClient.post(
        `${process.env.REACT_APP_BASE_URL}/api/board/remove-users/${boardId}`,
        { users }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
        {isLoggedIn() && (
          <div className="flex items-center space-x-6">
            <div
              className="flex items-center cursor-pointer hover:text-blue-200"
              onClick={() => navigate("/kanban")}
            >
              <FiGrid className="text-2xl mr-2" />{" "}
              <span className="text-lg">All Boards</span>
            </div>
            {isBoardView && selectedBoard?.ownerId === currentUser?.id && (
              <>
                <div
                  className="flex items-center cursor-pointer hover:text-blue-200"
                  onClick={handleAddUser}
                >
                  <FiUserPlus className="text-2xl mr-2" />
                  <span className="hidden sm:inline">Add</span>
                </div>
                <div
                  className="flex items-center cursor-pointer hover:text-blue-200"
                  onClick={handleRemoveUsers}
                >
                  <FiUserMinus className="text-2xl mr-2" />
                  <span className="hidden sm:inline">Remove</span>
                </div>
              </>
            )}
            {isBoardView && (
              <div
                className="flex items-center cursor-pointer hover:text-blue-200"
                onClick={() => navigate(`/kanban/messages/${boardId}`)}
              >
                <FiMessageSquare className="text-2xl mr-2" />
                <span className="hidden sm:inline">Messages</span>
              </div>
            )}
            {isMessagesView && (
              <div
                className="flex items-center cursor-pointer hover:text-blue-200"
                onClick={() => navigate(`/kanban/board/${boardId}`)}
              >
                <FiClipboard className="text-2xl mr-2" />
                <span className="hidden sm:inline">Board</span>
              </div>
            )}
            <div
              className="flex items-center cursor-pointer hover:text-red-300"
              onClick={onLogout}
            >
              <FiLogOut className="text-2xl mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </div>
            <div className="flex items-center">
              <FiUser className="text-2xl mr-2 text-yellow-400" />{" "}
              <span className="font-semibold text-lg text-white bg-blue-700 p-2 rounded-md shadow-lg">
                {currentUser?.username}
              </span>{" "}
            </div>
          </div>
        )}
      </div>
      <AddUserModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onAddUsers={handleAddUsersToBoard}
      />
      <RemoveUserModal
        isVisible={isRemoveModalVisible}
        onClose={handleCloseRemoveUserModal}
        onRemoveUsers={handleRemoveUsersFromBoard}
      />
    </header>
  );
};

export default Header;
