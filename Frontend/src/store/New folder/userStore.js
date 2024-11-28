import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('users' , () => {
    const userList = ref([]);
    const authToken = localStorage.getItem('accessToken');

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
    
    return {userList , getUserList}
})