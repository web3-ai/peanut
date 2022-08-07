import { createWebHistory, createRouter } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";

const routes = [
  {
    path: "/hello-world",
    name: "HelloWorld",
    component: HelloWorld,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;