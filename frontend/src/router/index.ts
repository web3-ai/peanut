import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PublicationDetail from '../views/PublicationDetail.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'home',
    component: HomeView,
    children: [{ path: '/p/:internalPublicationId', name: 'publicationDetail', component: PublicationDetail }]
  },
  {
    path: '/popular',
    name: 'popular',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PopularView.vue')
  },
  {
    path: '/latest',
    name: 'latest',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import(/* webpackChunkName: "about" */ '../views/PublisherView.vue')
  },
  {
    path: '/search',
    name: 'search',
    props: route => ({ query: route.query.q }),
    component: () => import(/* webpackChunkName: "about" */ '../views/SearchView.vue')
  },
  {
    path: '/u/:profileId',
    name: 'profile',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProfileView.vue')
  },

  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   return { top: 0 }
  // },
})

export default router
