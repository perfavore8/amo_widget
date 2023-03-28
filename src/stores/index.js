import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        status: {
            confirm: true,
            paid: false,
            demo: false
        },
        defaultCode: '+7',
        jsonConfig: {},
        stage: 'START',
    },
    getters: {
        isBlocked(state) {
            return !state.status.confirm;
        },
        isConfirm(state) {
            return state.status.confirm;
        }
    },
    mutations: {
        changeConfirm(state) {
            state.status.confirm = !state.status.confirm;
        }
    },
    actions: {
        changeConfirm(context) {
            context.commit('changeConfirm');
        }
    }
});

export default store;