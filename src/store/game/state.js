export default {
    state: {
        gamePause: false,
        gameScores: [],
        gameOver: false,
        diffLevel: 1
    },
    getters: {
        getPause(state) {
            return state.gamePause;
        },
        getScores(state) {
            return state.gameScores;
        },
        getGameOver(state) {
            return state.gameOver;
        },
        getDiffLevel(state) {
            return Number(state.diffLevel);
        }
    },
    mutations: {
        setPause(state, payload) {
            state.gamePause = payload;
        },
        setScores(state, payload) {
            localStorage.setItem('gameScores', JSON.stringify(payload));
            state.gameScores = payload;
        },
        addNewScore(state, payload) {
            const scores = state.gameScores;
            scores.push(payload);
            scores.sort((a,b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0));
            localStorage.setItem('gameScores', JSON.stringify(scores));
            state.gameScores = scores;
        },
        setGameOver(state, payload) {
            state.gameOver = payload;
        },
        setDiffLevel(state, payload) {
            localStorage.setItem('diffLevel', JSON.stringify(payload));
            state.diffLevel = payload;
        }
    },
    actions: {
        setPauseAction({commit}, payload) {
            commit('setPause', payload);
        },
        setScoresAction({commit}, payload) {
            commit('setScores', payload);
        },
        addNewScoreAction({commit}, payload) {
            commit('addNewScore', payload);
        },
        setGameOverAction({commit}, payload) {
            commit('setGameOver', payload);
        },
        setDiffLevelAction({commit}, payload) {
            commit('setDiffLevel', payload ? payload : 1);
        }
    }
}