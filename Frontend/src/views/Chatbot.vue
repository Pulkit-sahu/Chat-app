
<template>
    
    
    <div class="fixed bottom-4 right-4 ">
        <button @click="toggleContainer" class="rounded-full p-3 bg-gradient-to-t from-[#3482FF] to-[#1050B5]">
            <img v-if="!showContainer" src="../assets/chat.svg" alt="" class="w-8">
            <img v-else src="../assets/cross.svg" alt="" class="w-8">
        </button>
    </div>

    <div ref="popup" v-if="showContainer" class="fixed right-4  rounded-lg bottom-20 bg-[#F8F8F8] w-[380px] h-3/4">
        <UserList v-if="!chatbotStore.selectedUser" />
        <Chatbox v-else />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Chatbox from '/src/components/Chatbox.vue';
import UserList from '/src/components/UserList.vue';
import { onClickOutside } from '@vueuse/core';
import useChatbotStore from 'src/store/chatbotStore';



const chatbotStore = useChatbotStore();
const showContainer = ref(false);
const popup = ref(null)

const CloseContainer = () => {
    if (showContainer.value) showContainer.value = false
    chatbotStore.selectedUser = null
}

const toggleContainer = () => {
    showContainer.value = !showContainer.value
    
}

onClickOutside(popup,CloseContainer)

onMounted(async () => {
    await chatbotStore.getProfileData();
    console.log(chatbotStore.profileData)
    await chatbotStore.getUserList(chatbotStore.profileData.role);
    await chatbotStore.getChats();
    chatbotStore.setupSocket();
})




</script>
