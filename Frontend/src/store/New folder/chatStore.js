import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useProfileStore } from "./profileStore";

const useChatStore = defineStore('chatStore', () => {
    const chats = ref([]);
    const loading = ref(false);
    const selectedUser = ref(null);
    const isChatboxOpen = ref(false); // New ref added
    const profileStore = useProfileStore();

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
            (chat.sender_id === selectedUser.value.id && chat.receiver_id === profileStore.profileData.id) || 
            (chat.sender_id === profileStore.profileData.id && chat.receiver_id === selectedUser.value.id)
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
            if (chat.receiver_id === profileStore.profileData.id && !chat.read_status) {

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
        markMessageAsRead // New function included in return
    }
});

export default useChatStore;

