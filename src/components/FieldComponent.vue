<template>
    <div ref="field" class="field">
        <div class="gameData">
            <div class="leftPart">
                <div class="gameSpeed">
                    <p>Current game speed: {{(speedLvl).toFixed(2)}}</p>
                    <p>Game score: {{(score).toFixed(2)}}</p>
                </div>
                <div class="score">
                    <p>Total Weight: {{leftWeight}}</p>
                    <p>Momentum: {{leftMomentum}}</p>
                </div>
            </div>
            <div class="rightPart">
                <div class="score">
                    <p>Total Weight: {{rightWeight}}</p>
                    <p>Momentum: {{rightMomentum}}</p>
                </div>
                <div class="btns">
                    <div class="btn settingBlock" @click="showModal('settingModal')">
                        <img :src="require('@/assets/setting.svg')" alt="setting">
                    </div>
                    <div class="btn scoreBlock" @click="showModal('scoreModal')">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="btn pauseBlock" @click="showModal('info')">
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        <canvas ref="canvas" class="canvas"></canvas>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
    data: () => ({
        canvas: null,
        ctx: null,
        params: {
            width: 0,
            height: 0
        },
        figures: {
            0: 'triangle',
            1: 'square',
            2: 'circle'
        },
        timer: null,
        leftWeight: 0,
        leftMomentum: 0,
        rightWeight: 0,
        rightMomentum: 0,
        gamePause: false,
        leftFallingFigure: null,
        rightFallingFigure: null,
        stableFigures: {
            left: [],
            right: []
        },
        speedLvl: 2,
        customSpeed: null,
        fps: 60,
        score: 0,
        degree: 0,
        moveSpeed: .1
    }),
    watch: {
        getDiffLevel() {
            this.speedLvl = this.getDiffLevel;
        },
        getPause() {
            this.gamePause = this.getPause;
            if (this.gamePause) {
                clearInterval(this.timer);
                this.timer = null;
            } else {
                this.initGameInterval();
            }
        },
        // Check left and right sides momentum and weight
        stableFigures: {
            deep: true,
            handler(value) {
                let leftWeight = 0;
                let leftMomentum = 0;
                let rightWeight = 0;
                let rightMomentum = 0;
                for (let i = 0; i < value.left.length; i++) {
                    leftWeight += value.left[i].weight;
                    leftMomentum += value.left[i].weight * (((5 - value.left[i].position.x) / 5 * 100) / 100);
                }
                for (let i = 0; i < value.right.length; i++) {
                    rightWeight += value.right[i].weight;
                    rightMomentum += value.right[i].weight * ((100 - ((5 - value.right[i].position.x) / 5 * 100)) / 100);
                }

                this.leftWeight = leftWeight;
                this.leftMomentum = (leftMomentum).toFixed(2);
                this.rightWeight = rightWeight;
                this.rightMomentum = (rightMomentum).toFixed(2);
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.init();
        }, 100);
    },
    computed: {
        ...mapGetters({
            getPause: 'getPause',
            gameOver: 'getGameOver',
            getDiffLevel: 'getDiffLevel',
        })
    },
    methods: {
        ...mapActions([
            'changeModalAction',
            'addNewScoreAction',
            'setGameOverAction'
        ]),
        restartGame() {
            location.reload();
        },
        gameOverMethod() {
            this.addNewScoreAction({time: new Date(), score: (this.score).toFixed(2)});
            clearInterval(this.timer);
            this.timer = null;
            clearInterval(this.speedInterval);
            this.speedInterval = null;
            this.setGameOverAction(true);
            this.gamePause = true;
            this.changeModalAction({show: true, type: 'gameOver', data: {score: this.score}});
        },
        setEmitterEvents() {
            this.emitter.on('move-right', () => {
                this.moveRight();
            });
            this.emitter.on('move-left', () => {
                this.moveLeft();
            });
            this.emitter.on('move-speed-start', () => {
                this.moveSpeedStart();
            });
            this.emitter.on('move-speed-stop', () => {
                this.moveSpeedStop();
            });
            this.emitter.on('restart-game', () => {
                this.restartGame();
            });
        },
        initGameInterval() {
            this.timer = setInterval(() => {
                // Init interval, if gameOver is false performed render method. Else reset interval
                !this.gameOver ? this.render() : () => {clearInterval(this.timer); this.timer = null;};
            }, 1000 / this.fps);
        },
        init() {
            this.speedLvl = this.getDiffLevel;
            this.setEmitterEvents();

            this.canvas = this.$refs.canvas;
            this.ctx = this.canvas.getContext('2d');

            this.params = this.canvas.getBoundingClientRect();
            
            this.canvas.width = this.params.width;
            this.canvas.height = this.params.height;
            this.canvas.style.minWidth = `${this.params.width}px`;
            this.canvas.style.minHeight = `${this.params.height}px`;
            this.canvas.style.maxWidth = `${this.params.width}px`;
            this.canvas.style.maxHeight = `${this.params.height}px`;

            this.boardCoordinates = {x: {start: 20, end: this.params.width - 20}, y: {start: this.params.height - 104, end: this.params.height - 100}};

            this.initGameInterval();

            this.speedInterval = setInterval(() => {
                if (!this.gamePause) {
                    if (this.speedLvl < this.getDiffLevel + 4) this.speedLvl += .01;
                    this.score += 1 + (this.speedLvl - 2);
                }
            }, 1000);

            this.generateFigure('left');
            this.generateFigure('right');
        },
        moveSpeedStart() {
            this.customSpeed = this.speedLvl + 5;
        },
        moveSpeedStop() {
            this.customSpeed = null;
        },
        moveRight() {
            if (this.leftFallingFigure) {
                this.leftFallingFigure.position.x - this.moveSpeed > 1 ? this.leftFallingFigure.position.x -= this.moveSpeed : this.leftFallingFigure.position.x = 1;
            }
        },
        moveLeft() {
            if (this.leftFallingFigure) {
                this.leftFallingFigure.position.x + this.moveSpeed < 5 ? this.leftFallingFigure.position.x += this.moveSpeed : this.leftFallingFigure.position.x = 4.99;
            }
        },
        // Set falling figure params
        generateFigure(direction) {
            const min = 0;
            const max = Object.keys(this.figures).length - 1;
            const figure = this.figures[Math.floor(Math.random() * (max - min + 1)) + min];
            const weight = Math.floor(Math.random() * (10 - 1 + 1) + 1);
            const position = {
                y: -(50 + (weight * 5)), 
                x: Math.random() * (5 - 1) + 1
            };

            // Direction is left or right
            this[`${direction}FallingFigure`] = {figure, weight, direction, position, generated: false};
        },
        // Render function, performed each fps
        render() {
            // Clearing canvas
            this.ctx.clearRect(0, 0, this.params.width, this.params.height);

            // Drawing triangle
            this.ctx.fillStyle = "#000";
            this.ctx.fillText(
                (this.degree).toFixed(2), 
                (this.params.width / 2) - 10, 
                this.params.height - 110
            );
            this.ctx.beginPath();
            this.ctx.moveTo((this.params.width / 2), this.params.height - 100);
            this.ctx.lineTo((this.params.width / 2) + 25, this.params.height);
            this.ctx.lineTo((this.params.width / 2) - 25, this.params.height);
            this.ctx.closePath();

            this.ctx.fillStyle = "#EB7600";
            this.ctx.fill();

            // Drawing board
            this.ctx.beginPath();
            if (this.degree > 0 || this.degree < 0) {
                this.ctx.moveTo(this.boardCoordinates.x.start, this.boardCoordinates.y.start - (this.degree * 5));
                this.ctx.lineTo(this.boardCoordinates.x.end, this.boardCoordinates.y.start + (this.degree * 5));
                this.ctx.lineTo(this.boardCoordinates.x.end, this.boardCoordinates.y.end + (this.degree * 5));
                this.ctx.lineTo(this.boardCoordinates.x.start, this.boardCoordinates.y.end - (this.degree * 5));
                this.ctx.lineTo(this.boardCoordinates.x.start, this.boardCoordinates.y.start - (this.degree * 5));
            } else {
                this.ctx.moveTo(this.boardCoordinates.x.start, this.boardCoordinates.y.start);
                this.ctx.lineTo(this.boardCoordinates.x.end, this.boardCoordinates.y.start);
                this.ctx.lineTo(this.boardCoordinates.x.end, this.boardCoordinates.y.end);
                this.ctx.lineTo(this.boardCoordinates.x.start, this.boardCoordinates.y.end);
                this.ctx.lineTo(this.boardCoordinates.x.start, this.boardCoordinates.y.start);
            }
            this.ctx.closePath();

            this.ctx.fillStyle = "#50C878";
            this.ctx.fill();

            // Drawing figures that have fallen
            this.drawStableFigures();

            // Drawing figures that fall
            this.drawFallingFigure(this.leftFallingFigure);
            this.drawFallingFigure(this.rightFallingFigure);

            if (this.leftMomentum > this.rightMomentum) {
                this.degree -= (this.leftMomentum - this.rightMomentum) / 100;
            } else if (this.leftMomentum < this.rightMomentum) {
                this.degree += (this.rightMomentum - this.leftMomentum) / 100;
            }

            if (this.degree < -30 || this.degree > 30) {
                this.gameOverMethod();
            }
        },
        drawStableFigures() {
            for (let i = 0; i <= this.stableFigures.left.length - 1; i++) {
                const figureWeight = (50 + (this.stableFigures.left[i].weight * 5));
                this.stableFigures.left[i].position.y = this.boardCoordinates.y.start - figureWeight - ((6 - this.stableFigures.left[i].position.x) * this.degree)
                this.drawFallingFigure(this.stableFigures.left[i], true);
            }
            for (let i = 0; i <= this.stableFigures.right.length - 1; i++) {
                const figureWeight = (50 + (this.stableFigures.right[i].weight * 5));
                this.stableFigures.right[i].position.y = this.boardCoordinates.y.start - figureWeight + (this.stableFigures.right[i].position.x * this.degree)
                this.drawFallingFigure(this.stableFigures.right[i], true);
            }
        },
        getXPosition(dir, type, fallingFigure) {
            const xStep = (((this.params.width - 40) / 2) / 5);

            if (type === 'figure') {
                return dir === 'left' ? (fallingFigure.position.x * xStep) - (50 + (fallingFigure.weight * 5)) : ((fallingFigure.position.x * xStep) - (50 + (fallingFigure.weight * 5))) + ((this.params.width / 2) - 20);
            } else if (type === 'text') {
                return dir === 'left' ? (fallingFigure.position.x * xStep) - ((50 + (fallingFigure.weight * 5)) / 2) - 4 : ((fallingFigure.position.x * xStep) - ((50 + (fallingFigure.weight * 5))) / 2) + ((this.params.width / 2) - 20) - 4;
            }
        },
        drawFallingFigure(fallingFigure, stable = false) {
            let textYPosition = 0;

            // drawing figure on params (x, y, height, weight) for square, circle and triangle
            if (fallingFigure.figure === 'square') {
                this.ctx.beginPath();
                this.ctx.fillStyle = "#318CE7";
                this.ctx.rect(
                    this.getXPosition(fallingFigure.direction === 'left' ? 'left' : 'right', 'figure', fallingFigure),
                    fallingFigure.position.y, 
                    50 + (fallingFigure.weight * 5), 
                    50 + (fallingFigure.weight * 5)
                );
                this.ctx.fill();
                textYPosition = fallingFigure.position.y - 5;
            } else if (fallingFigure.figure === 'circle') {
                this.ctx.beginPath();
                this.ctx.fillStyle = "#EFBD35";
                this.ctx.arc(
                    this.getXPosition(fallingFigure.direction === 'left' ? 'left' : 'right', 'figure', fallingFigure) + ((50 + (fallingFigure.weight * 5)) / 2), 
                    fallingFigure.position.y, 
                    50 + (fallingFigure.weight * 5), 
                    0, 
                    2 * Math.PI
                );
                this.ctx.stroke();
                this.ctx.fill();
                textYPosition = fallingFigure.position.y - (55 + (fallingFigure.weight * 5));
            } else if (fallingFigure.figure === 'triangle') {
                this.ctx.beginPath();
                this.ctx.fillStyle = "#50C878";
                this.ctx.moveTo(
                    this.getXPosition(fallingFigure.direction === 'left' ? 'left' : 'right', 'figure', fallingFigure) + ((50 + (fallingFigure.weight * 5)) / 2), 
                    fallingFigure.position.y
                );
                this.ctx.lineTo(
                    this.getXPosition(fallingFigure.direction === 'left' ? 'left' : 'right', 'figure', fallingFigure) + ((50 + (fallingFigure.weight * 5))), 
                    fallingFigure.position.y + ((50 + (fallingFigure.weight * 5)))
                );
                this.ctx.lineTo(
                    this.getXPosition(fallingFigure.direction === 'left' ? 'left' : 'right', 'figure', fallingFigure), 
                    fallingFigure.position.y + ((50 + (fallingFigure.weight * 5)))
                );
                this.ctx.lineTo(
                    this.getXPosition(fallingFigure.direction === 'left' ? 'left' : 'right', 'figure', fallingFigure) + ((50 + (fallingFigure.weight * 5)) / 2), 
                    fallingFigure.position.y
                );
                this.ctx.fill();
                textYPosition = fallingFigure.position.y - 5;
            }

            // drawing figure weight around figure
            this.ctx.fillStyle = "#000";
            this.ctx.fillText(
                fallingFigure.weight, 
                this.getXPosition(fallingFigure.direction === 'left' ? 'left' : 'right', 'text', fallingFigure), 
                textYPosition
            );
            this.ctx.stroke();
            this.ctx.closePath();

            if (!stable && fallingFigure) {
                let condition;
                if (fallingFigure.direction === 'left') {
                    if (this.degree > 0) {
                        condition = (fallingFigure.position.y + 1) + (50 + (fallingFigure.weight * 5)) >= this.boardCoordinates.y.start - ((6 - fallingFigure.position.x) * this.degree);   
                    } else if (this.degree < 0) {
                        condition = (fallingFigure.position.y + 1) + (50 + (fallingFigure.weight * 5)) >= this.boardCoordinates.y.start - ((6 - fallingFigure.position.x) * this.degree);
                    } else {
                        condition = (fallingFigure.position.y + 1) + (50 + (fallingFigure.weight * 5)) >= this.boardCoordinates.y.start;
                    }
                } else if (fallingFigure.direction === 'right') {
                    if (this.degree > 0) {
                        condition = (fallingFigure.position.y + 1) + (50 + (fallingFigure.weight * 5)) >= this.boardCoordinates.y.start + (fallingFigure.position.x * this.degree);   
                    } else if (this.degree < 0) {
                        condition = (fallingFigure.position.y + 1) + (50 + (fallingFigure.weight * 5)) >= this.boardCoordinates.y.start + (fallingFigure.position.x * this.degree);
                    } else {
                        condition = (fallingFigure.position.y + 1) + (50 + (fallingFigure.weight * 5)) >= this.boardCoordinates.y.start;
                    }
                }
                if (condition) {
                    this.score += fallingFigure.weight / 3;
                    this.stableFigures[fallingFigure.direction === 'left' ? 'left' : 'right'].push(fallingFigure);
                    this.generateFigure(fallingFigure.direction === 'left' ? 'left' : 'right');
                } else {
                    if (fallingFigure.direction === 'left' && this.customSpeed) {
                        fallingFigure.position.y += this.customSpeed;
                    } else {
                        fallingFigure.position.y += this.speedLvl;
                    }
                }
            }
        },
        showModal(type) {
            this.changeModalAction({show: true, type: type});
        },
    }
}
</script>

<style lang="scss" scoped>
.field{
    position: relative;
    min-width: 1200px;
    min-height: 815px;
    .canvas{
        border: 1px solid #000;
        width: 100%;
        max-width: 1200px;
        height: 750px;
        background: #f2f2f2;
    }
    .gameData{
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
        p{
            color: #fff;
        }
        .leftPart{
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            margin-right: 20px;
            width: 100%;
        }
        .rightPart{
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            margin-left: 20px;
            width: 100%;
            .btns{
                display: flex;
                .btn{
                    width: 40px;
                    min-width: 40px;
                    height: 40px;
                    min-height: 40px;
                    border-radius: 5px;
                    cursor: pointer;
                    background: rgba(0,0,0,.75);
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    padding-bottom: 7.5px;
                    margin-right: 10px;
                    border: 1px solid #fff;
                    &.settingBlock{
                        img{
                            width: 20px;
                            height: 20px;
                        }
                    }
                    &.scoreBlock{
                        span{
                            margin-left: 2px;
                            margin-right: 2px;
                            width: 4px;
                            background: #fff;
                            &:nth-child(1) {
                                height: calc(100% - 10px);
                            }
                            &:nth-child(2) {
                                height: calc(100% - 15px);
                            }
                            &:nth-child(3) {
                                height: calc(100% - 20px);
                            }
                        }
                    }
                    &.pauseBlock{
                        span{
                            height: calc(100% - 15px);
                            width: 4px;
                            background: #fff;
                            margin-left: 3px;
                            margin-right: 3px;
                        }
                    }
                }
            }
        }
        p{
            margin-top: 0;
            margin-bottom: 5px;
        }
    }
}
</style>