import Vue from "vue";
import VueRouter from "vue-router";
import index from "../views/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "",
    component: index,
  },
];

const router = new VueRouter({
  routes,
  mode: "hash",
});

export default router;
