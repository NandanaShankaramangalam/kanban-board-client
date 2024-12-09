import { useState } from "react";
import AddTask from "./Addtask.jsx";
import TasksContainer from "./Taskscontainer.jsx";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const Task = () => {
  const [newTask, setNewTask] = useState();
  return (
    <div>
      <AddTask socket={socket} setNewTask={setNewTask} />
      <TasksContainer socket={socket} setNewTask={setNewTask} />
    </div>
  );
};

export default Task;
