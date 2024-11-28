import { defineStore } from "pinia";
import { ref } from "vue";
import useChatStore from "./chatStore";
import { useProfileStore } from "./profileStore";
import { io } from "socket.io-client";

const useSocketStore = defineStore('socket', () => {
    const socket = ref(null);
    const chatStore = useChatStore();
    const profileStore = useProfileStore();
    const audio = new Audio('/src/assets/note.mp3'); // Path to your MP3 file
    const audio_read = new Audio('/src/assets/Receive.mp3'); // Path to your MP3 file
    
    
    const setupSocket = () => {
        const authToken = localStorage.getItem('accessToken');
        socket.value = io('http://localhost:5000', {
            query: {
                token: authToken
            },
            extraHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });

        socket.value.on('connect', () => {
            // console.log('Socket connected');
        });

        socket.value.on('connection', (res) => {
            console.log('Connection :', res);
            profileStore.isConnected=true
        });

        socket.value.on('disconnect', () => {
            console.log('Socket disconnected');
            profileStore.isConnected=false
        });

        

        socket.value.on('receive_message', (res) => {
            console.log('Received message:', res);
            chatStore.addMessage(res);

            // Play audio if chatbox is not open or message is from another user
            if (!chatStore.isChatboxOpen || chatStore.selectedUser?.id !== res.sender_id) {
                if (res.sender_id != profileStore.profileData.id) audio.play().catch((error) => console.error('Audio playback failed:', error));
            }

            // Mark message as read if the chatbox is open and the message is from the selected user
            if (chatStore.isChatboxOpen && chatStore.selectedUser && res.sender_id === chatStore.selectedUser.id) {
                if (res.sender_id != profileStore.profileData.id) audio_read.play().catch((error) => console.error('Audio playback failed:', error));
                markMessageRead(res.sender_id);
            }
        }); 

        socket.value.on('read_status_update', (data) => {
            console.log('Read status update:', data);
            chatStore.updateReadStatus(data.sender_id, data.receiver_id);
        });
    };

    const sendMessage = (message) => {
        if (socket.value) {
            socket.value.emit('smessage', message);
        }
    };

    const markMessageRead = (senderId) => {
        if (socket.value) {
            socket.value.emit('mark_message_read', { sender_id: senderId });
            chatStore.updateReadStatus(senderId, profileStore.profileData.id);
        }
    };

    return { socket, setupSocket, sendMessage, markMessageRead };
});

export default useSocketStore;
