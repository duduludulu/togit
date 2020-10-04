import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Category from '@/views/Category.vue'
import Mine from '@/views/Mine.vue'
import Cart from '@/views/Cart.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/mine',
    name: 'mine',
    component: Mine
  }, 
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  }, 
  {
    path: '/category',
    name: 'category',
    component: Category
  },
  {
    path: '/category/subCategory',
    name: 'subCategory',
    component: () => import(/* webpackChunkName: "subCategory" */ '../views/subCategory.vue')
  },
  , 
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ '../views/SearchPage.vue')
  },
  {
    path: '/search/result',
    name: 'searchResult',
    component: () => import(/* webpackChunkName: "search" */ '../views/SearchResult.vue')
  },
  {
    path: '/message',
    name: 'message',
    component: () => import(/* webpackChunkName: "message" */ '../views/Message.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '../views/Register.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  },
  {
    path: '/detail/pro',
    name: 'proPage',
    component: () => import(/* webpackChunkName: "proPage" */ '../views/Problem.vue')
  },
  {
    path: '/detail/sku',
    name: 'sku',
    component: () => import(/* webpackChunkName: "sku" */ '../views/Sku.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
