<template>
  <li class="w-full mb-2">
    <button @click="handleClick"
      class="w-full bg-white hover:bg-gray-100 grid grid-cols-6 items-center border-b border-gray-300 rounded-lg shadow-sm p-2 transition-all duration-200">
      <!-- User Avatar -->
      <div class="w-12 h-12 col-span-1 flex items-center justify-center bg-gray-200 rounded-full">
        <p class="text-gray-700 bg-gray-200 uppercase ">{{ user.name.charAt(0) }}</p>
      </div>

      <!-- User Details -->
      <div class="ml-4 col-span-4 mr-auto">
        <p class="text-gray-800 text-lg font-semibold">{{ user.name }}</p>
        <p class="text-gray-500 text-sm uppercase font-medium">{{ user.role }}</p>
      </div>

      <!-- Notifications -->
      <span v-if="notifications > 0" class="col-span-1 text-white-500 text-sm font-bold  bg-green-500 px-1 w-7 rounded-2xl py-1 ">{{ notifications }}</span>
      <p v-else class="text-blue-500 text-xs font-semibold">Start Chat</p>
    </button>
  </li>
</template>

<script setup>
import { computed } from 'vue';
import useChatbotStore from '../store/chatbotStore';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const chatbotStore = useChatbotStore();
const notifications = computed(() => chatbotStore.getNotifications[props.user.id] || 0);

const handleClick = () => {
  chatbotStore.selectedUser = props.user;
  chatbotStore.setChatboxOpen(true);
  if (notifications.value > 0) {
    chatbotStore.markMessageRead(props.user.id);
  }
};
</script>

