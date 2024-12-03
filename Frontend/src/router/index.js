import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from '../views/Signup.vue';
import HomeLayout from "../layout/HomeLayout.vue";
import Profile from "../views/Profile.vue";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  // Check if an access token exists in localStorage
  const token = localStorage.getItem('accessToken');
  // Return true only if the token exists and is not empty
  return token && token.trim() !== "";
};

const routes = [
  {
    path: '/',
    redirect: () => {
      // Redirect to home if authenticated, otherwise to login
      return isAuthenticated() ? '/home' : '/login';
    }
  },
  {
    path: '/',
    component: HomeLayout,
    children: [
      {
        path: 'home',
        component: Home,
        beforeEnter: (to, from, next) => {
          if (!isAuthenticated()) {
            next('/login'); // Redirect to login if not authenticated
          } else {
            next(); // Proceed to home
          }
        }
      },
      {
        path: 'profile',
        component: Profile,
        beforeEnter: (to, from, next) => {
          if (!isAuthenticated()) {
            next('/login'); // Redirect to login if not authenticated
          } else {
            next(); // Proceed to profile
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

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Redirect to login if trying to access protected routes without authentication
  if (!isAuthenticated() && to.path !== '/login' && to.path !== '/register') {
    next('/login');
  } else {
    next(); // Allow navigation
  }
});

export default router;
