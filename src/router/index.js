import Vue from "vue";
import VueRouter from "vue-router";
import home from "../views/home";
import meeting from "../views/meeting";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "",
    component: home,
  },
  {
    path: "/meeting",
    name: "",
    component: meeting,
  },
];

const router = new VueRouter({
  routes,
  mode: "hash",
});

export default router;
