import Vue from "vue/dist/vue.js";
// import Settings from "./components/settings.vue";
import MainPage from "./components/MainPage.vue";
import store from "./stores/index";

Vue.config.devtools = true;
Vue.config.silent = true;

const Widget = {
  render(self, el) {
    self.showProductsSearch((accountID, el) => {
      console.log("123", accountID, el);
      window.vue = new Vue({
        store: store,
        render: (h) => h(MainPage),
      }).$mount(el);

      // After you create app
    //   window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = window.vue.constructor;
    });

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

  settings(el) {
    console.debug("oneDocs settings");
  },

  onSave() {},

  destroy() {},

  contacts_selected() {},

  leads_selected() {},

  tasks_selected() {},
};

export default Widget;
