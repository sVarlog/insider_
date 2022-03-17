<template>
    <div class="content">
        <h2>Game over</h2>
        
        <p>Your current score: {{(data.score).toFixed(2)}}</p>

        <div class="btns">
            <button @click="restartGame">Restart game</button>
            <button @click="showScores">Score list</button>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    props: {
        data: {
            type: Object
        }
    },
    methods: {
        ...mapActions([
            'changeModalAction'
        ]),
        restartGame() {
            this.emitter.emit('restart-game');
        },
        showScores() {
            this.changeModalAction({show: true, type: 'scoreModal'});
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    .btns{
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        width: 100%;
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
            &:hover{
                background: rgba(49, 140, 231, 1);
            }
        }
    }
}
</style>