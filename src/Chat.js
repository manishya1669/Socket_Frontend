import React, { useState } from "react";
import { useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, userName, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                userName: userName,
                socid: socket.id,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };
            await socket.emit("send_message", messageData);
            setCurrentMessage("");
        }
    };
    useEffect(() => {
        const handleReceiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
        };
        socket.on("receive_message", handleReceiveMessage);
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket]);

    return (
        <div className="bg-gray-200 rounded-lg">
            <div className="p-2 mb-4 h-64 overflow-y-auto">
                {messageList.map((messageContent, index) => {
                    const { message, userName, socid, time } = messageContent;
                    const isSender = socid === socket.id;
                    const messageStyle = isSender
                        ? "bg-red-200 text-sm text-red-600 rounded-lg ml-auto"
                        : "bg-blue-100 text-blue-600 rounded-lg";
                    const textClass = isSender
                        ? "text-sm text-right"
                        : "text-sm text-left";

                    return (
                        <div
                            key={index}
                            className={`p-3 mb-2 shadow-md ${messageStyle} relative`}
                        >
                            <p className={`p-2 ${textClass}`}>{message}</p>
                            <p
                                className={`text-gray-500 text-xs absolute bottom-0 right-0 mb-1 mr-1`}
                            >
                                {time} by {userName}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center p-4 bg-gray-900">
                <input
                    className="flex-grow p-2 rounded-full bg-white focus:outline-none w-full md:w-1/2 lg:w-3/4 xl:w-4/5"
                    type="text"
                    placeholder="Hey..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                        e.key === "Enter" && sendMessage();
                    }}
                />
                <button
                    className="text-2xl text-green-500 hover:text-green-600 focus:outline-none ml-2 md:ml-10 lg:ml-20 xl:ml-30"
                    onClick={sendMessage}
                >
                    &#9658;
                </button>
            </div>
        </div>
    );
}

export default Chat;
