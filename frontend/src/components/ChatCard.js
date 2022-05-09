import React from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

function ChatCard({ info, selected }) {
    return(
        <ListItem alignItems="flex-start" sx={selected ? { bgcolor: 'whitesmoke', cursor: 'pointer' } : { cursor: 'pointer' }}>
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="http://placekitten.com/200/300" />
            </ListItemAvatar>
            <ListItemText
                sx={{ userSelect: 'none' }}
                primary={info.otherParticipants[0].username}
                secondary={info.lastMessage ? info.lastMessage.text : ''}
                secondaryTypographyProps={{ noWrap: true }}
            />
        </ListItem>
    );
}

export default ChatCard;