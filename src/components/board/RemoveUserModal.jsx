import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { getSelectedBoardInfo } from "../../utils/utils";

const RemoveUserModal = ({ isVisible, onClose, onRemoveUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const url = window.location.href;
  const boardInfo = getSelectedBoardInfo();
  const boardId = boardInfo?.id;
//   const boardId = url.split("/").pop();

  useEffect(() => {
    if (isVisible) {
      fetchUsers();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setSelectedUsers([]);
    }
  }, [isVisible]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) => (prev.includes(user) ? prev : [...prev, user]));
  };

  const handleDeselectUser = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u !== user));
  };

  const handleRemove = () => {
    onRemoveUsers(selectedUsers, boardId);
    onClose();
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get(
        `${process.env.REACT_APP_BASE_URL}/api/board/${boardId}/users`
      );

      const allUsers = response?.data?.users || [];
      const currentUser = JSON.parse(localStorage.getItem("user")); // Assuming you store the current user ID in localStorage
      console.log("cuuuuuuuuuuu:::", currentUser);

      const filteredUsers = allUsers.filter(
        (user) => user.id !== currentUser?.id
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.log(err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-black text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Remove People from Board</h2>
        {users?.length ? (
          <>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
            />
            <div className="space-y-2">
              {users
                .filter((user) =>
                  user?.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between text-black"
                  >
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user)}
                        onChange={() =>
                          selectedUsers.includes(user)
                            ? handleDeselectUser(user)
                            : handleSelectUser(user)
                        }
                        className="mr-2"
                      />
                      {user?.username}
                    </label>
                  </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            No users available to remove
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveUserModal;
