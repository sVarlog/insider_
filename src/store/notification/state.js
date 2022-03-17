export default {
    state: {
        notification: {
            show: false,
            text: null
        }
    },
    getters: {
        getNotification(state) {
            return state.notification;
        }
    },
    mutations: {
        setNotification(state, payload) {
            state.notification = payload;
        }
    },
    actions: {
        setNotificationAction({commit}, payload) {
            commit('setNotification', payload);
        }
    }
}