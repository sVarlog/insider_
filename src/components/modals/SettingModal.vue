<template>
    <div class="content">
        <h2>Settings</h2>
        <div class="settingBlock">
            <div class="settingItem">
                <p>Select game difficulty</p>
                <div class="btns">
                    <button :class="{active: getDiffLevel === 1}" @click="setDiff(1)">1</button>
                    <button :class="{active: getDiffLevel === 2}" @click="setDiff(2)">2</button>
                    <button :class="{active: getDiffLevel === 3}" @click="setDiff(3)">3</button>
                </div>
            </div>
            <div class="settingItem">
                <p>Reset game score list</p>
                <div class="btns">
                    <button @click="resetScores">Reset</button>
                </div>
            </div>
        </div>
        <button class="restart" @click="restartGame">Restart game</button>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'getDiffLevel'
        ])
    },
    methods: {
        ...mapActions([
            'setDiffLevelAction',
            'setNotificationAction',
            'setScoresAction'
        ]),
        setDiff(level) {
            this.setDiffLevelAction(level);
            this.setNotificationAction({show: true, text: `Now game diff level is: ${level}`});
        },
        resetScores() {
            this.setScoresAction([])
            this.setNotificationAction({show: true, text: `All game scores reseted`});
        }
    }
}
</script>

<style lang="scss" scoped>
.content{
    .settingBlock{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .settingItem{
            width: 100%;
            .btns{
                display: flex;
                margin-top: 10px;
                margin-bottom: 10px;
                button{
                    min-width: 50px;
                    height: 40px;
                    min-height: 40px;
                    border: 0;
                    outline: 0;
                    background: rgba(49, 140, 231, .75);
                    transition: .25s;
                    color: #fff;
                    margin-right: 15px;
                    border-radius: 5px;
                    padding-left: 10px;
                    padding-right: 10px;
                    &.active{
                        background: rgba(49, 140, 231, 1);
                    }
                    &:hover{
                        background: rgba(49, 140, 231, 1);
                    }
                }
            }
            p{
                font-weight: 700;
            }
        }
    }
    button.restart{
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