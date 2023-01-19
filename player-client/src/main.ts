import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import components from "@/components";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPaperPlane, faCheck } from "@fortawesome/free-solid-svg-icons";

library.add(faPaperPlane, faCheck);

const app = createApp(App);

app.use(router);

Object.entries(components).map(([name, component]) => {
  app.component(name, component);
});

app.component("font-awesome-icon", FontAwesomeIcon);

app.directive("focus", {
  mounted(el) {
    el.focus();
    el.click();
  },
});

app.mount("#app");
