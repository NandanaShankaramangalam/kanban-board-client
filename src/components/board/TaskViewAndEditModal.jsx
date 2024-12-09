import React, { useState, useEffect } from "react";

const TaskViewAndEditModal = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  boardUsers,
}) => {
  const [taskDetails, setTaskDetails] = useState(task);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(
    task?.assigneeId || ""
  );

  useEffect(() => {
    setTaskDetails(task);
    if (task?.assigneeId) {
      const assignee = boardUsers.find((user) => user?.id === task?.assigneeId);
      setSelectedAssignee(assignee ? assignee?.username : "");
    }
  }, [task, boardUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(taskDetails);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(taskDetails?.taskId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <span className="text-xl font-bold text-gray-700">&times;</span>
        </button>

        <h2 className="text-2xl font-bold mb-4">Task Details</h2>
        {isEditing ? (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={taskDetails.title || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={taskDetails.description || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Assignee</label>
              <select
                name="assigneeId"
                value={selectedAssignee}
                onChange={(e) => {
                  setSelectedAssignee(e.target.value);
                  setTaskDetails((prev) => ({
                    ...prev,
                    assigneeId: e.target.value,
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded text-black"
              >
                <option value="" className="text-gray-700">
                  Select Assignee
                </option>
                {boardUsers.map((user) => (
                  <option
                    key={user?.id}
                    value={user?.id}
                    className="text-gray-700"
                  >
                    {user?.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <p className="p-2 border border-gray-300 rounded bg-gray-100">
                {taskDetails?.title || "No title"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <p className="p-2 border border-gray-300 rounded bg-gray-100">
                {taskDetails?.description || "No description"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Assignee</label>
              <p className="p-2 border border-gray-300 rounded bg-gray-100">
                {selectedAssignee || "Unassigned"}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskViewAndEditModal;
