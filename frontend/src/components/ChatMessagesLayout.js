import { Avatar, InputBase, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from 'moment';
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import ChatMessages from "./ChatMessages";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

function ChatMessagesLayout({ userId, chat, setChats }) {
    const [ arrivalMessage, setArrivalMessage ] = useState(null);
    const [ messagesComponent, setMessagesComponent ] = useState(null);

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

        function updateMessagesComponent(components, msg) {
            let lastMsgGroup = components[components.length-1];
            if(lastMsgGroup.props.side === 'right') {
                if(msg.senderId === userId) {
                    // let newComponents = [...components];
                    lastMsgGroup.props.messages.push(msg.text);
                    return [...components];
                } else {
                    console.log("push2");
                    return [...components, <ChatMessages key={msg._id} side={'left'} messages={[msg.text]}/>];
                }
            } else {
                if(msg.senderId !== userId) {
                    // let newComponents = [...components];
                    lastMsgGroup.props.messages.push(msg.text);
                    return [...components];
                } else {
                    console.log("push4");
                    return [...components, <ChatMessages key={msg._id} side={'right'} messages={[msg.text]}/>];
                }
            }
        }

        if(arrivalMessage) {
            console.log("arrive");
            const message = {
                _id: arrivalMessage._id,
                senderId: arrivalMessage.senderId,
                text: arrivalMessage.text,
                timeStamp: arrivalMessage.timeStamp
            };
            setChats(prev => updateChats(prev, message, arrivalMessage.chatId));
            if(chat.participantIds.includes(message.senderId)) {
                console.log("outside");
                const updatedMessagesComponent = updateMessagesComponent(messagesComponent, message);
                setMessagesComponent(updatedMessagesComponent);
                console.log(messagesComponent);
                let messagesBox = document.getElementById('messages');
                messagesBox.scrollTop = messagesBox.scrollHeight;
            }
        }
    }, [arrivalMessage, setChats]);

    useEffect(() => {
        function populateMessagesComponent(messages) {
            let components = [];
            messages.forEach(message => {
                if(components.length > 0) {
                    let lastMsgGroup = components[components.length-1]
                    if(message.senderId === userId) {
                        if(lastMsgGroup.props.side === 'right') {
                            lastMsgGroup.props.messages.push(message.text);
                        } else {
                            components.push(
                                <ChatMessages
                                    key={message._id}
                                    side={'right'}
                                    messages={[message.text]}
                                />
                            );
                        }
                    } else {
                        if(lastMsgGroup.props.side === 'left') {
                            lastMsgGroup.props.messages.push(message.text);
                        } else {
                            components.push(
                                <ChatMessages
                                    key={message._id}
                                    side={'left'}
                                    messages={[message.text]}
                                />
                            );
                        }
                    }
                } else {
                    if(message.sendId === userId) {
                        components.push(
                            <ChatMessages
                                key={message._id}
                                side={'right'}
                                messages={[message.text]}
                            />
                        );
                    } else {
                        components.push(
                            <ChatMessages
                                key={message._id}
                                side={'left'}
                                messages={[message.text]}
                            />
                        );
                    }
                }
            });
            console.log(components);
            setMessagesComponent(components);
        }

        if(chat) {
            console.log("populating");
            populateMessagesComponent(chat.messages);
        }
    }, [chat]);

    useEffect(() => {
        let messagesBox = document.getElementById('messages');
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }, [messagesComponent]);

    const muiBaseTheme = createTheme();

    return(
        <ThemeProvider theme={muiBaseTheme}>
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
                    sx={{
                        height: '100%',
                        maxHeight: 496,
                        p: 2,
                        overflow: 'auto',
                    }}
                    id='messages'
                >
                    {messagesComponent ? messagesComponent.map((component) => component) : ''}
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
        </ThemeProvider>
    );
}

export default ChatMessagesLayout;