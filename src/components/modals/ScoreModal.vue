<template>
    <div class="content">
        <h2>Scores</h2>

        <div class="scoreList">
            <template v-if="getScores.length > 0">
                <div v-for="scoreItem in getScores" :key="scoreItem.time" class="scoreItem">
                    <div class="left">
                        <span>{{getValidTime(scoreItem.time)}}</span>
                    </div>
                    <div class="right">
                        <span>{{(Number(scoreItem.score)).toFixed(2)}}</span>
                    </div>
                </div>
            </template>
            <template v-else>
                <p>No game scores yet</p>
            </template>
        </div>

        <button @click="restartGame">Restart game</button>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'getScores'
        ])
    },
    methods: {
        getValidTime(date) {
            const newDate = new Date(date);
            const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
            const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
            const year = newDate.getFullYear();
            return `${day}.${month}.${year}`;
        },
        restartGame() {
            this.emitter.emit('restart-game');
        },
    }
}
</script>

<style lang="scss" scoped>
.content{
    .scoreList{
        width: 100%;
        display: flex;
        flex-direction: column;
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
        padding-right: 10px;
        padding-left: 10px;
        &::-webkit-scrollbar {
            width: 1em;
        }
        &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgba(49, 140, 231, .75);
            outline: 1px solid slategrey;
        }
        .scoreItem{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            border-bottom: 1px solid #000;
        }
    }
    button{
        width: calc(50% - 10px);
        height: 45px;
        min-height: 45px;
        background: rgba(49, 140, 231, .75);
        transition: .25s;
        color: #fff;
        border: 0;
        outline: 0;
        border-radius: 5px;
        margin-top: 20px;
        &:hover{
            background: rgba(49, 140, 231, 1);
        }
    }
}
</style>