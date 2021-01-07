import Vue from "vue";
import VueRouter from "vue-router";
import Meta from "vue-meta";
import DefaultLayout from "@/layout/DefaultLayout.vue";

Vue.use(VueRouter);
Vue.use(Meta);

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/Home")
      },
      {
          path: "/premier",
          name: "Premier",
          component: () => import("@/views/Premier")
      }
    ]
  },
  {
    path: "*",
    component: () => import("@/views/NotFound"),
    meta: {
      requiresAuth: false,
      requiresGuest: false
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  beforeEach: "",
  routes
});

export default router;
