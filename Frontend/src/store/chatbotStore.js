import axios from "axios";
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { computed, ref } from "vue";

const useChatbotStore = defineStore('chatbot' , () => {
    const chats = ref([]);
    const loading = ref(false);
    const selectedUser = ref(null);
    const isChatboxOpen = ref(false); // New ref added
    const profileData = ref({});
    const authToken = localStorage.getItem('accessToken');
    const isConnected = ref(false)
    const socket = ref(null);
    const audio = new Audio('/src/assets/note.mp3'); // Path to your MP3 file
    const audio_read = new Audio('/src/assets/Receive.mp3'); // Path to your MP3 file
    const userList = ref([]);
    

    const getChats = async () => {
        try {
            loading.value = true;
            const authToken = localStorage.getItem('accessToken');
            const res = await axios.get('http://localhost:5000/chat/loaded', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            chats.value = res.data || [];
        } catch (error) {
            console.error('Error fetching chats:', error.message);
        } finally {
            loading.value = false;
        }
    }

    const filteredChats = computed(() => {
        if (!selectedUser.value) return [];
        return chats.value.filter(chat => 
            (chat.sender_id === selectedUser.value.id && chat.receiver_id === profileData.value.id) || 
            (chat.sender_id === profileData.value.id && chat.receiver_id === selectedUser.value.id)
        );
    });

    const addMessage = (message) => {
        chats.value.push(message);
    }

    const updateReadStatus = (senderId, receiverId) => {
        chats.value = chats.value.map(chat => {
            if (chat.sender_id === senderId && chat.receiver_id === receiverId) {
                return { ...chat, read_status: true };
            }
            return chat;
        });
    }

    const getNotifications = computed(() => {
        const notifications = {};
        chats.value.forEach(chat => {
            if (chat.receiver_id === profileData.value.id && !chat.read_status) {

                notifications[chat.sender_id] = (notifications[chat.sender_id] || 0) + 1;
                
            }
        });
        return notifications;
    });

    // New functions added
    const setChatboxOpen = (isOpen) => {
        isChatboxOpen.value = isOpen;
    }

    const markMessageAsRead = (messageId) => {
        const message = chats.value.find(chat => chat.id === messageId);
        if (message) {
            message.read_status = true;
        }
    }

    const getProfileData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/chat/info' , {
                headers : {
                    Authorization : `Bearer ${authToken}`
                }
            });
            profileData.value = res.data;
            
        } catch (error) {
            console.log("error occured in fetching profile")
            console.log(error)
        }
    }

    getProfileData();

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
            isConnected.value = true
        });

        socket.value.on('disconnect', () => {
            console.log('Socket disconnected');
            isConnected.value =false
        });

        

        socket.value.on('receive_message', (res) => {
            console.log('Received message:', res);
            addMessage(res);

            // Play audio if chatbox is not open or message is from another user
            if (res.receiver_id === profileData.value.id) {
                // If the chatbox is not open or the message is from another user, play the notification sound
                if (!isChatboxOpen || (selectedUser.value?.id !== res.sender_id)) {
                    audio.play().catch((error) => console.error('Audio playback failed:', error));
                }
        
                // If the chatbox is open and the message is from the selected user, play the "read" sound and mark the message as read
                if (isChatboxOpen && selectedUser && res.sender_id === selectedUser.value.id) {
                    audio_read.play().catch((error) => console.error('Audio playback failed:', error));
                    markMessageRead(res.sender_id);
                }
            }
        });
        socket.value.on('read_status_update', (data) => {
            console.log('Read status update:', data);
            updateReadStatus(data.sender_id, data.receiver_id);
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
            updateReadStatus(senderId, profileData.value.id);
        }
    };

    const getUserList = async (role) => {
        try {
            console.log(role)
            
            if(role == 'admin')
            {
                const res = await axios.get('http://localhost:5000/chat/users', {
                    headers : {
                        Authorization : `Bearer ${authToken}`
                    }
                })
                userList.value = res.data;
                const res2 = await axios.get('http://localhost:5000/chat/admins', {
                    headers : {
                        Authorization : `Bearer ${authToken}`
                    }
                })
                userList.value = [...userList.value , ...res2.data.filter(user => user.id != profileData.value.id)];
                console.log(userList.value)
            }
            else{
                const res = await axios.get('http://localhost:5000/chat/admins', {
                    headers : {
                        Authorization : `Bearer ${authToken}`
                    }
                })
                userList.value = res.data;
                console.log(userList.value)
            }

          
        } catch (error) {
            console.log("err on userstore")
        }
    }


    return { 
        chats, 
        filteredChats, 
        getChats, 
        selectedUser, 
        loading, 
        addMessage, 
        updateReadStatus,
        getNotifications,
        isChatboxOpen, // New ref included in return
        setChatboxOpen, // New function included in return
        markMessageAsRead, // New function included in return
        profileData, 
        getProfileData, 
        authToken,
        isConnected,
        socket, 
        setupSocket, 
        sendMessage, 
        markMessageRead,
        userList, 
        getUserList
    }
})

export default useChatbotStore;