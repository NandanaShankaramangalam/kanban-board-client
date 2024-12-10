import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import apiClient from "../../api/apiClient";
import { getSelectedBoardInfo } from "../../utils/utils";
import socket from "../../socket/socket";

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const boardInfo = getSelectedBoardInfo();
  const boardId = boardInfo?.id;
  const mentionDropdownRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    handleFetchMessage();

    socket.emit("joinBoard", boardId);

    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [boardId]);

  useEffect(() => {
    if (showMentions && mentionDropdownRef.current) {
      mentionDropdownRef.current.scrollTop = 0;
    }
  }, [filteredUsers]);

  const scrollContainerRef = useRef();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const messageId = `MSG-${Date.now()}`;
    const mentions = extractMentions(message);

    try {
      const newMessage = {
        messageId,
        boardId,
        userId,
        message,
        mentions,
      };

      if (mentions.includes("AI")) {
        await apiClient.post(
          `${process.env.REACT_APP_BASE_URL}/api/messages/ai-bot/${boardId}`,
          newMessage
        );
      } else {
        await apiClient.post(
          `${process.env.REACT_APP_BASE_URL}/api/messages/${boardId}`,
          newMessage
        );
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFetchMessage = async () => {
    try {
      const response = await apiClient.get(
        `${process.env.REACT_APP_BASE_URL}/api/messages/${boardId}`
      );
      setMessages(response.data);

      const usersResponse = await apiClient.get(
        `${process.env.REACT_APP_BASE_URL}/api/board/${boardId}/users`
      );
      const aiBot = {
        id: "AI-0001",
        username: "AI",
      };
      setUsers([...usersResponse?.data?.users, aiBot]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    const lastWord = value.split(" ").pop();
    if (lastWord.startsWith("@")) {
      setShowMentions(true);
      const query = lastWord.substring(1).toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.username.toLowerCase().includes(query) &&
            user.id !== currentUser?.id
        )
      );
    } else {
      setShowMentions(false);
    }
  };

  const handleUserClick = (username) => {
    const words = message.split(" ");
    words.pop();
    setMessage([...words, `@${username} `].join(" "));
    setShowMentions(false);
  };

  const extractMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    let mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const username = match[1];
      if (
        filteredUsers.some(
          (user) => user?.username.toLowerCase() === username.toLowerCase()
        )
      ) {
        mentions.push(username);
      }
    }
    return mentions;
  };

  return (
    <>
      <div className="bg-white mt-4 shadow-lg rounded-lg p-6 border border-gray-200 max-w-4xl mx-auto min-h-[500px]">
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto max-h-96 mb-4 p-2 border border-gray-200 rounded-lg min-h-[400px]"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 p-4 mt-20">
              No messages yet. Be the first to start the conversation!
            </div>
          ) : (
            <div>
              {[...messages]
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map((msg) => (
                  <div
                    key={msg.messageId}
                    className={`p-2 rounded-lg mb-1 relative ${
                      msg.isBotResponse ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <strong className="text-sm text-gray-800">
                        {msg?.username}:
                      </strong>
                    </div>
                    <div className="text-sm text-gray-700">
                      {msg?.message.split("\n").map((line, index, array) => (
                        <React.Fragment key={index}>
                          {line}
                          {index < array.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    {msg.mentions && msg.mentions.length > 0 && (
                      <div className="text-xs text-blue-500 mt-1">
                        Mentions: {msg.mentions.join(", ")}
                      </div>
                    )}
                    <div className="absolute bottom-1 right-2 text-xs text-gray-500">
                      {dayjs(msg.timestamp).format("MMM D, YYYY h:mm A")}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="relative flex mt-4">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Post your message to the ${boardInfo?.name} board...`}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-3 rounded-r-lg hover:bg-blue-600 transition duration-200"
          >
            Send
          </button>
          {showMentions && (
            <div
              ref={mentionDropdownRef}
              className="absolute bottom-12 left-0 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
            >
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.username)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {user.username}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
