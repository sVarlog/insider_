export default {
    state: {
        modalData: {
            show: false,
            type: ''
        }
    },
    getters: {
        getModalData(state) {
            return state.modalData;
        }
    },
    mutations: {
        setModalData(state, payload) {
            state.modalData = payload;
        }
    },
    actions: {
        changeModalAction({commit}, payload) {
            commit('setModalData', payload);
        }
    }
}