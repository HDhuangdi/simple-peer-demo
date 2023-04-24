import Vue from "vue";
import VueRouter from "vue-router";
import send from "../views/send";
import receive from "../views/receive";
import mul from "../views/mul";
import mobile from "../views/mobile";
import hzwaterit from "../views/hzwaterit";

Vue.use(VueRouter);

const routes = [
  {
    path: "/send.html",
    name: "send",
    component: send,
  },
  {
    path: "/receive.html",
    name: "receive",
    component: receive,
  },
  {
    path: "/mul",
    name: "mul",
    component: mul,
  },
  {
    path: "/mobile",
    name: "mobile",
    component: mobile,
  },
  {
    path: "/hzwaterit",
    name: "hzwaterit",
    component: hzwaterit,
  },
];

const router = new VueRouter({
  routes,
  mode: "hash",
  base: '/meeting/'
});

export default router;
