import { createRouter, createWebHistory } from "vue-router";
import PrivateLayout from "@/layouts/PrivateLayout.vue";
import PublicLayout from "@/layouts/PublicLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Vehicle from "@/pages/Vehicle.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Map from "@/pages/Map.vue";

const routes = [
	{
		path: "/",
		redirect: () => {
			const token = localStorage.getItem("token");
			return token ? "/dashboard" : "/login";
		},
	},
	{
		path: "/",
		component: PublicLayout,
		children: [
			{ path: "login", name: "Login", component: Login },
			{ path: "register", name: "Register", component: Register },
		],
	},
	{
		path: "/",
		component: PrivateLayout,
		meta: { requiresAuth: true },
		children: [
			{ path: "dashboard", name: "Dashboard", component: Dashboard },
			{ path: "maps", name: "Map", component: Map },
			{ path: "vehicles", name: "Vehicle", component: Vehicle },
		],
	},
  ];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const token = localStorage.getItem("token");

	if (to.meta.requiresAuth && !token) {
		next({ path: "/login" });
	}
	else if ((to.path === "/login" || to.path === "/register") && token) {
		next({ path: "/dashboard" });
	}
	else {
		next();
	}
});

export default router;
