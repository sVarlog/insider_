<template>
    <div class="wrap" @click.self="closeModal" :class="{show}">
        <info-modal v-if="getModalType === 'info'" :data="getModalData.data" />
        <game-over-modal v-if="getModalType === 'gameOver'" :data="getModalData.data" />
        <score-modal v-if="getModalType === 'scoreModal'" />
        <setting-modal v-if="getModalType === 'settingModal'" />
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import InfoModal from './InfoModal.vue';
import GameOverModal from './GameOverModal.vue';
import ScoreModal from './ScoreModal.vue';
import SettingModal from './SettingModal.vue';

export default {
    data: () => ({
        show: false
    }),
    beforeMount() {
        this.setPauseAction(true);
    },
    beforeUnmount() {
        this.setPauseAction(false);
    },
    mounted() {
        this.init();
    },
    computed: {
        ...mapGetters([
            'getModalData',
            'getGameOver'
        ]),
        getModalType() {
            return this.getModalData.type
        }
    },
    components: {
        InfoModal,
        GameOverModal,
        ScoreModal,
        SettingModal
    },
    methods: {
        ...mapActions([
            'changeModalAction',
            'setPauseAction'
        ]),
        init() {
            setTimeout(() => this.show = true, 50);
            this.emitter.on('close-modal', this.closeModal);
            this.emitter.on('restart-game', this.closeModal);
        },
        closeModal() {
            if (!this.getGameOver) {
                this.show = false;
                setTimeout(() => this.changeModalAction({show: false, type: ''}), 250);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    position: fixed;
    z-index: 150;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0);
    backdrop-filter: blur(0);
    -webkit-backdrop-filter: blur(0);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .25s all;
    &.show{
        background: rgba(0,0,0,.6);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        .content{
            opacity: 1;
            transform: scale(1);
        }
    }
    .content{
        opacity: 0;
        transform: scale(.8);
        transition: .25s all;
        border-radius: 10px;
        background: #fff;
        margin: 0 25px;
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-width: 400px;
        max-width: calc(500px - 20px);
    }
}
</style>