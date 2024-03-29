import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "@fortawesome/fontawesome-free/js/all";
import VueAxios from "vue-axios";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

axios.defaults.baseURL = process.env.VUE_APP_API_URI

createApp(App)
    .use(router)
    .use(VueAxios, axios)
    .use(Toast)
    .mount("#app");
