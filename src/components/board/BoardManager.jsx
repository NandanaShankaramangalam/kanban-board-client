import React, { useState, useEffect } from "react";
import CreateBoard from "./createBoard";
import { io } from "socket.io-client";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const BoardManager = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const response = await apiClient.get(
      `${process.env.REACT_APP_BASE_URL}/api/board`
    );
    setBoards(response.data);
  };

  const handleBoardCreated = (newBoard) => {
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  return (
    <div className="p-4">
      <CreateBoard onBoardCreated={handleBoardCreated} />
      <div className="mt-4">
        {boards?.length ? (
          <>
            <h2 className="text-lg font-bold">Available Boards:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {boards.map((board) => (
                <div
                  className="cursor-pointer border border-gray-300 rounded overflow-hidden bg-white shadow-lg"
                  key={board._id}
                  onClick={() => {
                    setSelectedBoard(board);
                    localStorage.setItem(
                      "selectedBoard",
                      JSON.stringify(board)
                    );
                    navigate(`/kanban/board/${board?.id}`);
                  }}
                >
                  <div className="px-6 py-8">
                    <div className="font-bold text-xl mb-2 text-center">
                      {board?.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center mt-36 text-gray-500">
            No boards found! Let's get started by creating your first board to
            organize your tasks and collaborate with your team.
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardManager;
