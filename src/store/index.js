import {createStore} from 'vuex';
import ModalsModule from './modals/state.js';
import GameModule from './game/state.js';
import NotificationModule from './notification/state.js';

export default createStore({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        ModalsModule,
        GameModule,
        NotificationModule
    }
});
