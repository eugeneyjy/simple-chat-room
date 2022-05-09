import { Avatar, InputBase, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from 'moment';
import { useEffect, useState } from "react";
import socket from "../utils/socket";

function ChatMessagesLayout({ userId, chat, setChats }) {
    const [ arrivalMessage, setArrivalMessage ] = useState(null);
    const [ messages, setMessages ] = useState(null);
    console.log("==chat", chat);

    async function sendMsg(e) {
        if(e.key === 'Enter' && !e.shiftKey && e.currentTarget.value) {
            e.preventDefault();
            const msgText = e.currentTarget.value;
            e.currentTarget.value = '';
            const timeStamp = moment().format();
            const message = {
                senderId: userId,
                text: msgText,
                timeStamp: `${timeStamp}`
            }
            console.log(JSON.stringify(message));
            try {
                const res = await fetch(
                    `http://localhost:8000/conversations/${chat._id}/messages`,
                    {
                        method: 'POST',
                        body: JSON.stringify(message),
                        headers: { 'Content-type': 'application/json' },
                        credentials: 'include'
                    }
                );
                if(res.status === 200) {
                    const responseBody = await res.json();
                    const receiverId = chat.participantIds.find((pid) => pid !== userId);
                    console.log("==receiverId", receiverId);
                    const socketMessage = {
                        _id: responseBody._id,
                        chatId: chat._id,
                        senderId: userId,
                        receiverId: receiverId,
                        text: msgText,
                        timeStamp: `${timeStamp}`
                    }
                    socket.emit("sendPrivateMessage", socketMessage);
                    setArrivalMessage(socketMessage);
                } else {
                    throw new Error("Failed to send message");
                }
            } catch(err) {
                console.log(err);
                alert(err);
            }
        }
    }

    function controlNewLine(e) {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
        }
    }

    useEffect(() => {
        socket.on("getPrivateMessage", data => {
            setArrivalMessage(data);
        });
    }, []);

    useEffect(() => {
        function updateChats(chats, msg, chatId) {
            return chats.map((c) => {
                if(c._id === chatId) {
                    return {...c, lastMessage: msg};
                }
                return c;
            });
        }

        if(arrivalMessage) {
            const message = {
                _id: arrivalMessage._id,
                senderId: arrivalMessage.senderId,
                text: arrivalMessage.text,
                timeStamp: arrivalMessage.timeStamp
            };
            console.log("==arrival", arrivalMessage);
            setChats(prev => updateChats(prev, message, arrivalMessage.chatId));
            if(chat.participantIds.includes(message.senderId)) {
                console.log("==message", message);
                setMessages(prev => [...prev, message]);
            }
        }
    }, [arrivalMessage, setChats]);

    useEffect(() => {
        if(chat) {
            setMessages(chat.messages);
        }
    }, [chat]);

    return(
        <Box
            sx={{ 
                bgcolor: 'grey',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Paper
                square
                elevation={0}
                variant="outlined"
                sx={{ p: '12px 10px', display: 'flex', alignItems: 'center' }}
            >
                <Avatar alt="Remy Sharp" src="http://placekitten.com/200/300" sx={{ mr: 2 }}/>
                <Typography variant="h6" color="inherit" component="div">
                    {chat ? chat.participants.filter(p => p._id !== userId)[0].username : ''}
                </Typography>
            </Paper>
            <Box
                sx={{height: '100%'}}
            >
                {messages ? messages.map((message) => (<div key={message._id}>{message.text}</div>)) : ''}
            </Box>
            <Paper
                square
                elevation={0}
                variant="outlined"
                sx={{ p: '10px 10px' }}
            >
                <Paper
                    square={false}
                    variant="outlined"
                    sx={{ borderRadius: 5, display: 'flex' }}
                >
                    <InputBase
                        sx={{ ml: 1, pr: 2, pl: 2, width: '100%' }}
                        placeholder="Start new conversation"
                        inputProps={{ 'aria-label': 'Start new conversation' }}
                        multiline
                        maxRows={5}
                        onKeyUp={(e) => sendMsg(e)}
                        onKeyDown={(e) => controlNewLine(e)}
                    />
                </Paper>
            </Paper>
        </Box>
    );
}

export default ChatMessagesLayout;