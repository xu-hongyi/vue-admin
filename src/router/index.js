import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login"
import Home from "@/views/Home"
import Welcome from "@/views/Welcome"
import User from '@/views/User'
import Power from '@/views/Power'
import Roles from '@/views/Roles'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    redirect:"/welcome",
    children:[
      {
        path:"/welcome",
        component:Welcome,
        name:"welcome"
      },
      {
        path:"/users",
        name:"users",
        component:User
      },
      {
        path:"/rights",
        name:"rights",
        component:Power
      },
      {
        path:"/roles",
        name:"roles",
        component:Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = window.sessionStorage.getItem("token");
    if (!token) {
      next("/login")
    } else {
      next()
    }
  }
})

export default router
