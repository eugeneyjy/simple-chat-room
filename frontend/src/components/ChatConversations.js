import { Divider, List } from "@mui/material";
import { Box } from "@mui/system";
import ChatCard from "./ChatCard";

function ChatConversations({ chats }) {
    console.log("chats", chats);
    return(
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <List sx={{ width: '100%' }}>
                {chats.map(chat => (
                    <div key={chat._id}>
                        <ChatCard info={chat}/>
                        <Divider variant="inset" component="li" />
                    </div>
                ))}
            </List>
        </Box>
    );
}

export default ChatConversations;