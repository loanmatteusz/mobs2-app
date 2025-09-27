import { createApp } from "vue";
import "./style.css";
import Toast, { POSITION } from "vue-toastification";
import App from "./App.vue";
import router from "./router";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);
app.use(Toast, {
    position: POSITION.BOTTOM_RIGHT,
    timeout: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
});

app.mount("#app");
