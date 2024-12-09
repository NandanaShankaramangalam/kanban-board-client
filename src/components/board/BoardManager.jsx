import React, { useState, useEffect } from "react";
import CreateBoard from "./createBoard";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

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
        <h2 className="text-lg font-bold">Available Boards:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div
              className="cursor-pointer border border-gray-300 rounded overflow-hidden bg-white shadow-lg"
              key={board._id}
              onClick={() => {
                setSelectedBoard(board);
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
      </div>
    </div>
  );
};

export default BoardManager;
