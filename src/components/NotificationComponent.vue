<template>
    <div class="notification" :class="{show}">
        <span>{{getNotificationText}}</span>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            default: 'Success',
            type: String
        }
    },
    data: () => ({
        show: false
    }),
    computed: {
        getNotificationText() {
            return this.$props.text ? this.$props.text : 'Success';
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.show = true;
        });
        setTimeout(() => {
            this.show = false;
            // Hide notification after hide animation
            setTimeout(() => {
                this.emitter.emit('close-notification');
            }, 250);
        }, 2000);
    }
}
</script>

<style lang="scss" scoped>
.notification{
    position: fixed;
    z-index: 150;
    top: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    pointer-events: none;
    transition: .25s;
    opacity: 0;
    &.show{
        opacity: 1;
    }
    span{
        height: 100%;
        min-height: 45px;
        padding: 10px 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0,0,0,0.75);
        transition: .25s;
        color: #fff;
        font-weight: 700;
        border-radius: 10px;
    }
}
</style>