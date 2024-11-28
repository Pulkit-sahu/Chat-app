import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from '../views/Signup.vue';
import HomeLayout from "../layout/HomeLayout.vue";
import Profile from "../views/Profile.vue";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  // Check if an access token exists in localStorage or sessionStorage
  // You can replace this with your own authentication check logic
  return localStorage.getItem('accessToken') !== "";
};

const routes = [
  {
    path: '/',
    component: HomeLayout,
    children: [
      {
        path: '/',
        component: Home,
        beforeEnter: (to, from, next) => {
          // If not authenticated, redirect to login page
          if (!isAuthenticated()) {
            next('/login');
          } else {
            next(); // Proceed to home page if authenticated
          }
        }
      },
      {
        path: '/profile',
        component: Profile,
        beforeEnter: (to, from, next) => {
          // If not authenticated, redirect to login page
          if (!isAuthenticated()) {
            next('/login');
          } else {
            next(); // Proceed to profile if authenticated
          }
        }
      }
    ]
  },
  { path: '/login', component: Login },
  { path: '/register', component: Signup }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard (optional, can be used for redirecting unauthenticated users to the login page)
router.beforeEach((to, from, next) => {
  // If trying to access protected route without being authenticated, redirect to login
  if (!isAuthenticated() && to.path !== '/login' && to.path !== '/register') {
    next('/login');
  } else {
    next(); // Allow navigation
  }
});

export default router;
