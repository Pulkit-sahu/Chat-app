<!-- <template>
    <p class="text-4xl font-semibold mt-1 ml-12">Welcome, {{ profile.name }}</p>
    <div class="w-[95%] mx-auto grid grid-cols-2 gap-3 mt-4">
        <div class="border border-gray-500 rounded col-span-2 lg:col-span-1 p-5 bg-slate-900 overflow-y-auto h-[35rem]">

            <UserElement :name="user.name" :id="user.id" :key="user.id" v-for="user in users"
                @click="updateSelectedUser(user)" />

        </div>
        <div class="border border-gray-500 rounded col-span-2 lg:col-span-1 p-5">
            <div v-if="Object.keys(selectedUser).length === 0" class="text-white">
                <p>Noting to display</p>
            </div>
            <div v-else class="text-white">
                <Chatbox :closeChatBox="closeChatBox" :selectedUser="selectedUser"  />
            </div>
        </div>

    </div>
</template>
<script setup>

import { onMounted, reactive, ref } from "vue";
import UserElement from '../components/UserElement.vue';
import { useUserStore } from '../store/userStore';
import { useProfileStore } from "../store/profileStore";
import Chatbox from "../components/Chatbox.vue";
import { useRouter } from "vue-router";

const router = useRouter()

const selectedUser = ref({});
const userStore = useUserStore();
const profileStore = useProfileStore();


 
const users = ref([]);
const profile = ref({});

onMounted(async () => {
  
    // Fetch the profile data first
    await profileStore.getProfileData();
    profile.value = profileStore.profileData;

    console.log(profile.value);
    // Use profile.id for fetching other data
    const [userList, chats] = await Promise.all([
    
        userStore.getUserList(profileStore.profileData.role),
        // chatStore.getChats(profileStore.profileData.id),
    ]);

    // Assign the fetched data to reactive variables
    users.value = userStore.userList;
 
});

const updateSelectedUser = (user) => {
    selectedUser.value = user
}

const closeChatBox = () => {
    selectedUser.value = {};
}

</script> -->

<template>
    <p class="text-4xl font-semibold mt-1 ml-12">Welcome {{ chatbotStore.profileData.name }}</p>
    
    <Chatbot/>
</template>

<script setup>

import { onMounted } from 'vue';
import Chatbot from '/src/views/Chatbot.vue';
import useChatbotStore from '../store/chatbotStore';
const chatbotStore = useChatbotStore()

onMounted(async () => {
    await chatbotStore.getProfileData();
    
    
    
})

</script>
