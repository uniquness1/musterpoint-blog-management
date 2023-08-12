import { createRouter, createWebHistory } from 'vue-router'
import Home from "../views/HomeView.vue"
import CreatePost from "../views/CreatePost.vue"
import SinglePost from "../views/SinglePost.vue"
import EditPost from "../components/EditPost.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: '/post/create',
      component: CreatePost
    },
    {
      path: '/post/:postId',
      name: 'SinglePost',
      component: SinglePost
    },
    {
      path: '/post/edit/:postId',
      name: 'EditPost',
      component: EditPost
    }
  ],
});

export default router