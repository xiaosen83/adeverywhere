// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'
import store from './store'

import App from './App'
import Home from './components/Home'
import Users from './components/Users'
import Ads from './components/Ads'
import Cars from './components/Cars'
import EditCar from './components/EditCar'
import EditUser from './components/EditUser'
import EditAd from './components/EditAd'
import Login from './components/Login'
import Register from './components/Register'
import 'bootstrap/dist/css/bootstrap.css'

Vue.use(VeeValidate)
Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/ads',
    component: Ads
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/cars',
    component: Cars
  },
  {
    path: '/editAd',
    component: EditAd
  },
  {
    path: '/editAd/:id',
    name: 'editAd',
    component: EditAd
  },
  {
    path: '/editCar',
    component: EditCar
  },
  {
    path: '/editUser/:id',
    name: 'editUser',
    component: EditUser
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  }
]

const router = new VueRouter({routes})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  ...App
})
