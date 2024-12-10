import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { getSelectedBoardInfo } from "../../utils/utils";

const AddTaskModal = ({ socket, onClose, handleAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState("to_do");
  const [assignee, setAssignee] = useState({});
  const [users, setUsers] = useState([]);
  const url = window.location.href;
  // const boardId = url.split("/").pop();
  const boardInfo = getSelectedBoardInfo();
  const boardId = boardInfo?.id;

  const columns = ["to_do", "in_progress", "done"];

  useEffect(() => {
    fetchUsersInBoard();
  }, []);

  const fetchUsersInBoard = async () => {
    try {
      const response = await apiClient.get(
        `${process.env.REACT_APP_BASE_URL}/api/board/${boardId}/users`
      );
      setUsers(response?.data?.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      column,
      assignee: assignee?.id,
    };

    handleAddTask(newTask);
    setTitle("");
    setDescription("");
    setColumn("Todo");
    setAssignee({});
    onClose();
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
        <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
        <form className="space-y-5" onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="column" className="block mb-1 font-medium">
              Column
            </label>
            <select
              id="column"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={column}
              onChange={(e) => setColumn(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="assignee" className="block mb-1 font-medium">
              Assignee
            </label>
            <select
              id="assignee"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={assignee?.username || ""}
              onChange={(e) => {
                const selectedUsername = e.target.value;
                const selectedUser = users.find(
                  (user) => user.username === selectedUsername
                );
                setAssignee(selectedUser);
              }}
            >
              <option value="" disabled>
                Select Assignee
              </option>{" "}
              {users.map((user) => (
                <option key={user?.id} value={user?.username}>
                  {user?.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
