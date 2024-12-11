import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import apiClient from "../../api/apiClient";
import TaskViewAndEditModal from "./TaskViewAndEditModal";
import { getSelectedBoardInfo } from "../../utils/utils";

const TasksContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [boardUsers, setBoardUsers] = useState([]);
  const boardInfo = getSelectedBoardInfo();
  const boardId = boardInfo?.id;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsersInBoard();
  }, []);

  useEffect(() => {
    fetchTasks();
    socket.emit("joinBoard", boardId);
    socket.on("taskAdded", (task) => {
      fetchTasks();
    });

    socket.on("taskUpdated", (updatedTask) => {
      fetchTasks();
    });

    socket.on("taskDeleted", (taskId) => {
      fetchTasks();
    });

    socket.on("taskMoved", (tasks) => {
      setTasks(tasks);
    });

    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("taskMoved");
    };
  }, [boardId, socket]);

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    const updatedTasks = { ...tasks };
    const sourceColumn = updatedTasks[source.droppableId];
    const destinationColumn = updatedTasks[destination.droppableId];

    const [movedTask] = sourceColumn.items.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destinationColumn.items.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
    socket.emit("taskDragged", {
      source,
      destination,
      tasks: updatedTasks,
      movedTask,
      boardId,
    });
  };

  const fetchUsersInBoard = async () => {
    try {
      const response = await apiClient.get(
        `${process.env.REACT_APP_BASE_URL}/api/board/${boardId}/users`
      );
      setBoardUsers(response?.data?.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get(
        `${process.env.REACT_APP_BASE_URL}/api/board/${boardId}/tasks`
      );
      setTasks(response?.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err?.response?.status === 403) {
        navigate("/kanban");
      }
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const taskId = updatedTask?.taskId;
      const response = await apiClient.put(
        `${process.env.REACT_APP_BASE_URL}/api/board/${boardId}/tasks/${taskId}`,
        updatedTask
      );
      socket.emit("taskUpdated", response.data);
    } catch (error) {
      console.error("Error saving task:", error);
      if (error?.response?.status === 403) {
        navigate("/kanban");
      }
    } finally {
      handleCloseModal();
    }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await apiClient.delete(
        `${process.env.REACT_APP_BASE_URL}/api/board/${boardId}/tasks/${taskId}`
      );
      socket.emit("taskUpdated", response.data);
    } catch (error) {
      console.error("Error saving task:", error);
      if (error?.response?.status === 403) {
        navigate("/kanban");
      }
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map((task) => (
          <div
            className={`${task[1].title.toLowerCase()}__wrapper`}
            key={task[1].title}
          >
            <h3>{task[1].title} Tasks</h3>
            <div className={`${task[1].title.toLowerCase()}__container`}>
              <Droppable droppableId={task[1].title}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {task[1].items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${task[1].title.toLowerCase()}__items`}
                          >
                            <p>{item.title}</p>
                            <p
                              className="comment"
                              onClick={() => handleTaskClick(item)}
                            >
                              <Link>View Task</Link>
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
      <TaskViewAndEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        onSave={handleSaveTask}
        boardUsers={boardUsers}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default TasksContainer;
