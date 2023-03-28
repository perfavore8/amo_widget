import Vue from "vue/dist/vue.js";
import Settings from "./components/settings.vue";
import store from "./stores/index";

Vue.config.devtools = true;
Vue.config.silent = true;

const Widget = {
  render(self, func) {
    console.log("123", self, func);

    return true;
  },

  init() {
    console.debug("oneDocs init");
    return true;
  },

  bind_actions() {
    console.debug("oneDocs bind_actions");
    return true;
  },

  settings() {
    window.vue = new Vue({
      store: store,
      render: (h) => h(Settings),
    }).$mount(Settings.$el);

    // After you create app
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = window.vue.constructor;

    console.debug("oneDocs settings");
  },

  onSave() {},

  destroy() {},

  contacts_selected() {},

  leads_selected() {},

  tasks_selected() {},
};

export default Widget;
