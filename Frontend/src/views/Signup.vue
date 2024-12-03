<template>

    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Create a new account
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="fullname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                            <input type="text" name="fullname" id="fullname"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Full Name" required="" v-model="formData.name">
                        </div>
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                email</label>
                            <input type="email" name="email" id="email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com" required="" v-model="formData.email">
                        </div>
                        
                        <div>
                            <label for="password"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required="" v-model="formData.password">
                        </div>
                        <div class="flex justify-between w-full">

                            <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                                <input id="bordered-radio-1" type="radio" value="user" name="bordered-radio" v-model="formData.role"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="bordered-radio-1"
                                    class="w-full py-2 px-4 text-lg font-medium text-white">User</label>
                            </div>
                            <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                                <input checked id="bordered-radio-2" type="radio" value="admin" name="bordered-radio" v-model="formData.role"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                                <label for="bordered-radio-2"
                                    class="w-full py-2 px-4 text-lg font-medium text-white">Admin</label>
                            </div>

                        </div>
                        <button type="button" @click="handleRegister"
                            class="w-full text-white bg-blue-600 hover:bg-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center  ">Sign Up</button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account yet? <RouterLink to="/login"
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500">Log in</RouterLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();


const formData = reactive({
    name : "" ,
    email : "",
    password : "",
    role : ""
})
const handleRegister = async () => {
    try {
<<<<<<< HEAD
    const res = await axios.post("http://localhost:5000/auth/register" , formData);
=======
    const res = await axios.post("https://chat-app-e0vz.onrender.com/auth/register" , formData);
>>>>>>> c93332ff6b90684965591d378372d066fd7c2938
    console.log(res);
    
    router.push("/login")
    toast.add({ severity: 'success', summary: 'Success Message', detail: res.data.message, life: 3000 });
} catch (error) {
    console.log(error)
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
}
}


</script>
