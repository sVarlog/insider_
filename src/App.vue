<template>
    <div class="app">
		<img :src="require('@/assets/bg.gif')" alt="gif" class="bgImg">
		<div class="contentContainer">
			<field-component />
		</div>
		<modal-parent v-if="getModalData.show" />
		<notification-component v-if="getNotification.show" :text="getNotification.text" />
	</div>
</template>

<script>
import '@/assets/css/normalize.css';
import {mapActions, mapGetters} from 'vuex';
import ModalParent from '@/components/modals/ModalParent.vue';
import FieldComponent from '@/components/FieldComponent.vue';
import NotificationComponent from '@/components/NotificationComponent.vue';

export default {
	computed: {
		...mapGetters([
			'getModalData',
			'getNotification'
		])
	},
	components: {
		ModalParent,
		FieldComponent,
		NotificationComponent
	},
	created() {
		this.setDataFromLocalStorage();
	},
	mounted() {
		this.initEvents();
	},
	methods: {
		...mapActions([
			'changeModalAction',
			'setScoresAction',
			'setDiffLevelAction',
			'setNotificationAction'
		]),
		setDataFromLocalStorage() {
			if (localStorage.getItem('gameScores')) {
				this.setScoresAction(JSON.parse(localStorage.getItem('gameScores')));
			}
			this.setDiffLevelAction(JSON.parse(localStorage.getItem('diffLevel')));
		},
		initEvents() {
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' || e.keyCode === 27) {
					if (!this.getModalData.show) {
						this.changeModalAction({show: true, type: 'info'});
					} else {
						this.emitter.emit('close-modal');
					}
				} else if (e.key === 'd' || e.keyCode === 68 || e.key === 'ArrowRight' || e.keyCode === 39) {
					this.emitter.emit('move-left');
				} else if (e.key === 's' || e.keyCode === 83 || e.key === 'ArrowDown' || e.keyCode === 40) {
					this.emitter.emit('move-speed-start');
				} else if (e.key === 'a' || e.keyCode === 65 || e.key === 'ArrowLeft' || e.keyCode === 37) {
					this.emitter.emit('move-right');
				}
			});
			document.addEventListener('keyup', (e) => {
				if (e.key === 's' || e.keyCode === 83 || e.key === 'ArrowDown' || e.keyCode === 40) {
					this.emitter.emit('move-speed-stop');
				}
			});
			this.emitter.on('close-notification', () => {this.setNotificationAction({show: false, text: null})});
		}
	}
}
</script>

<style lang="scss" scoped>
.app{
	width: 100%;
	min-width: 100vh;
	height: 100%;
	min-height: 100vh;
	position: relative;
	.bgImg{
		position: absolute;
		z-index: 1;
		top: -5px;
		left: 0;
		right: 0;
		bottom: 5px;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.contentContainer{
		position: relative;
		z-index: 2;
		height: 100%;
		width: 100%;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px 50px;
	}
}
</style>
