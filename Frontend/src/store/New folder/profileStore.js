import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore('profile' , () => {
    const profileData = ref({});
    const authToken = localStorage.getItem('accessToken');
    const isConnected = ref(false)
    
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

    return {profileData , getProfileData , authToken,isConnected}
});