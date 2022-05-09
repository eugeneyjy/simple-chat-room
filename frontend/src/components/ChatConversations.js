import { Divider, List } from "@mui/material";
import { Box } from "@mui/system";
import ChatCard from "./ChatCard";

function ChatConversations({ chats, currentChat, onChatClick }) {
    console.log("chats", chats);
    return(
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <List sx={{ width: '100%', pt: 0 }}>
                {chats.map((chat, idx) => (
                    <div key={chat._id} onClick={() => onChatClick(idx)}>
                        <ChatCard info={chat} selected={currentChat===idx}/>
                        <Divider variant="inset" component="li" />
                    </div>
                ))}
            </List>
        </Box>
    );
}

export default ChatConversations;