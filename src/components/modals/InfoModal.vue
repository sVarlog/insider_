<template>
    <div class="content">
        <h2>Pause</h2>
        <p><span>&larr; or A:</span> click to move left</p>
        <p><span>&rarr; or D:</span> click to move right</p>
        <p><span>&darr; or S:</span> click to hasten the fall</p>
        <p><span>ESC:</span> pause/continue game</p>

        <button @click="restartGame">Restart game</button>
    </div>
</template>

<script>
export default {
    methods: {
        restartGame() {
            location.reload();
        },
    }
}
</script>

<style lang="scss" scoped>
.content{
    h2{
        align-self: center;
    }
    button{
        margin-top: 10px;
        width: 150px;
        height: 45px;
        min-height: 45px;
        background: rgba(49, 140, 231, .75);
        transition: .25s;
        color: #fff;
        border: 0;
        outline: 0;
        border-radius: 5px;
        align-self: center;
        margin-top: 20px;
        &:hover{
            background: rgba(49, 140, 231, 1);
        }
    }
}
</style>