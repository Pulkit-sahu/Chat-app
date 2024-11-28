<template>
    <div class=" rounded-lg h-full flex-1 bg-white">
        <!-- Welcome Message -->
         
        <div class="p-4 bg-gradient-to-t from-[#3482FF]  to-[#1050B5] flex justify-between rounded-lg">
            <p class="text-white text-lg font-bold mb-2">Hey! Welcome to chat area✌️</p>
            <img v-if="isConnected" src="/src/assets/green.svg" alt="" class="w-9 bg-white px-2  rounded-3xl">
            <img v-else src="/src/assets/red.svg" alt="" class="w-9 bg-white px-2  rounded-3xl">
        </div>

        <!-- Search Bar -->
        <div v-if="chatbotStore.profileData.role === 'admin'" class="flex justify-around">
            <button @click="changeActiveTab('admins')" class="p-4 w-full font-bold text-sm text-[#333333] hover:bg-gray-200 transition-all duration-150" :class="{'border-b-2 border-blue-400' :  activeTab === 'admins'}">Admins</button>
            <button @click="changeActiveTab('users')" class="p-4 w-full font-bold text-sm text-[#333333] hover:bg-gray-200 transition-all duration-150" :class="{'border-b-2 border-blue-400' :  activeTab === 'users'}">Users</button>

         </div>
        <div class="w-full p-3 flex justify-start ">
            <img src="../assets/search.svg" alt="Search" class="mr-1">
            <input type="text" v-model="searchQuery" placeholder="Search with name"
                class="w-[95%] px-4 m-2  py-2  bg-white text-black border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-400" />
        </div>

        <!-- User List -->
        <div v-if="filteredUsers.length > 0" class="p-1 -mt-2 overflow-y-auto h-80">
            <ul>
                <UserElement v-for="user in filteredUsers" :user="user"/>
            </ul>
        </div>

        <!-- No Users Available -->
        <p v-else class="text-center text-gray-500 p-4">No users available</p>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import UserElement from './UserElement.vue';
import useChatbotStore from '../store/chatbotStore';

const chatbotStore = useChatbotStore();
const searchQuery = ref("");
const activeTab = ref('admins');

const changeActiveTab = (name) => {
    activeTab.value = name;
}


const isConnected = ref(false)

watch( ()=> chatbotStore.isConnected, ()=> {
    
    isConnected.value = chatbotStore.isConnected

})

onMounted(()=>{
    isConnected.value = chatbotStore.isConnected
})

const fetchFiltered = (arr) => {

    if(activeTab.value === 'admins')
    {
        return arr.filter(x => 
            x.role === 'admin'
        )
    }
    else
    {
        return arr.filter(x => 
            x.role === 'user'
        )
    }
}

const filteredUsers = computed(() => {
    if (!searchQuery.value.trim()) {
        return fetchFiltered(chatbotStore.userList);
    }
    return fetchFiltered(chatbotStore.userList).filter(user =>
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});


</script>