import { useEffect } from 'react';

function useFetchChat(conversationId, setChat) {
    useEffect(() => {
        console.log("converseId", conversationId);
        async function fetchChat() {
            let responseBody = {};
            try {
                const response = await fetch(
                    `http://localhost:8000/conversations/${conversationId}`,
                    {
                        credentials: 'include'
                    }
                )
                if(response.status !== 200) {
                    throw response.status;
                }
                responseBody = await response.json();
            } catch(e) {
                console.log(e);
                throw e;
            }
            setChat(responseBody);
        }

        if(conversationId) {
            fetchChat();
        }
    }, [ conversationId, setChat ]);

    return [];
}

export default useFetchChat;