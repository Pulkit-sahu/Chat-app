<template>
    <Menubar :model="navItems" />
</template>
  
  <script setup>
  import Menubar from 'primevue/menubar';
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();

  const isMenuOpen = ref(false)
  const handleLogout = () => {
    localStorage.setItem('accessToken' , "null");

    router.push("/login")
  }
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }
  
  const navItems = [
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'Profile',
        icon: 'pi pi-star'
    },
    {
        label: 'Logout',
        icon: 'pi pi-home',
        command : handleLogout
    },
  ]


  </script>