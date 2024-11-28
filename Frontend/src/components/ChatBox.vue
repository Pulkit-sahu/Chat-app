<template>
    <div class="flex flex-col h-full relative">
      <div class="header w-full bg-white p-4 flex items-center rounded-t-lg shadow-md border-b">
        <div class="w-full flex items-center space-x-4">
          <button @click="() => chatbotStore.selectedUser = null" class="close-button p-2">
            <img src="../assets/back.svg" alt="closeButton">
          </button>
          <div class="avatar bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 uppercase">
            <span>{{ chatbotStore.selectedUser.name.charAt(0) }}</span>
            
          </div>
          <div>
            <p class="text-gray-900 font-bold text-lg">{{ chatbotStore.selectedUser.name }}</p>
            <p class="text-gray-500 text-xs uppercase">{{ chatbotStore.selectedUser.role }}</p>
          </div>
        </div>
        <div><img v-if="isConnected" src="/src/assets/green.svg" alt="" class="w-9 bg-white px-2  rounded-3xl">
          <img v-else src="/src/assets/red.svg" alt="" class="w-9 bg-white px-2  rounded-3xl"></div>
      </div>
  
      <!-- Chat Messages -->
      <div ref="chatContainer" class="bg-[#F8F8F8] flex-grow  h-[40rem] overflow-y-auto space-y-4">
        <div v-if="!isConnected" class="fixed bg-white z-20 opacity-75 w-[25rem] h-80">afsdasdas</div>
        <div v-if="chatbotStore.loading" class="flex justify-center mt-4">
          <ProgressSpinner />
        </div>
        <template v-else>
          
          <div v-for="chat in chatbotStore.filteredChats" :key="chat.id"
            :class="['w-full flex mb-2', chat.sender_id === chatbotStore.profileData.id ? 'justify-end' : 'justify-start']">
            
            <div
              :class="['max-w-[75%] px-4 py-2 gap-4 justify-between flex items-end border-2 rounded-xl', chat.sender_id === chatbotStore.profileData.id ? 'bg-[#A4E6B2] rounded-br-none' : 'bg-[#B9E7FF] rounded-bl-none']">
              
              <p class="text-18px text-[#222222]">{{ chat.content }}</p>
              
              <span class="text-xs text-gray-400">{{ formatTime(chat.timestamp) }}</span>
              <div v-if="chat.sender_id === chatbotStore.profileData.id" class="relative">
                
                <img v-if="!chat.read_status" src="../assets/tick.svg" alt="Unread" class="w-4 scale-150">
                <img v-if="chat.read_status" src="../assets/doubleTick.svg" alt="Read" class="w-4">
              </div>
            </div>
          </div>
        </template>
      </div>
      <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="showErrorModal" class="absolute z-30 w-[95%] mx-auto  rounded-md shadow-lg py-4 bg-white text-red-700 font-semibold px-2 -bottom-3  -translate-y-24">
        Message Not Sent ! Wait For The Internet
      </div>
    </transition>
      <!-- Message Input -->
      <div class="bg-[#F8F8F8] p-3 rounded-b-lg flex items-center">
        <input v-model="message" @keyup.enter="sendMessage" placeholder="Enter your message here" type="text"
          class="flex-grow rounded-full bg-[#F8F8F8] p-4 text-black placeholder-gray-400 focus:outline-none" />
        
          
        <button @click="sendMessage" :disabled="!message.trim()"
          class="bg-blue-500 p-3 rounded-full hover:bg-blue-600 transition ml-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <i class="pi pi-send text-white" style="font-size: larger;"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
  import ProgressSpinner from 'primevue/progressspinner';
  import useChatbotStore from '../store/chatbotStore';
  

  const chatbotStore = useChatbotStore();
  const showErrorModal = ref(false);
  const isConnected = ref(false)
  const message = ref('');
  const chatContainer = ref(null);
  
  onMounted(() => {
    chatbotStore.setChatboxOpen(true);
    isConnected.value = chatbotStore.isConnected
    scrollToBottom();
  });
  
  onUnmounted(() => {
    chatbotStore.setChatboxOpen(false);
  });
  
  const sendMessage = () => {
    if (chatbotStore.isConnected){ 
    if (message.value.trim()) {
      const newMessage = {
        content: message.value,
        sender_id: chatbotStore.profileData.id,
        receiver_id: chatbotStore.selectedUser.id
      };
      chatbotStore.sendMessage(newMessage);
      message.value = '';
    }}
    else {
      showErrorModal.value = true;
      setTimeout(() => {
        showErrorModal.value = false;
      }, 3000);
    }
  };
 
watch( ()=> chatbotStore.isConnected, ()=> {
    
    isConnected.value = chatbotStore.isConnected

})



  const scrollToBottom = () => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  };
  
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to format timestamp as date only
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

  watch(
    () => chatbotStore.filteredChats,
    (newChats) => {
      nextTick(() => {
        scrollToBottom();
        if (chatbotStore.isChatboxOpen) {
          newChats.forEach(chat => {
            if (chat.sender_id === chatbotStore.selectedUser.id && !chat.read_status) {
            
              chatbotStore.markMessageRead(chat.sender_id);
              const onlineAudio = new Audio('../assets/online_.mp3')
                onlineAudio.play();
            }
          });
        }
      });
    },
    { deep: true }
  );
  </script>
  
  