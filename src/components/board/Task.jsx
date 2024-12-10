import { useState } from "react";
import AddTask from "./Addtask.jsx";
import TasksContainer from "./Taskscontainer.jsx";
import io from "socket.io-client";
import socket from "../../socket/socket.js";

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
