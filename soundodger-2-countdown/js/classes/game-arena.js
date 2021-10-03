// complete arena with arena, emitters and player etc
class GameArena extends GameObject {
    constructor(x, y, size, colors) {
        super(x, y);
        this.logo = new Image();
        this.logo.src = "images/sd2-logo.png";

        let mainColor = colors.main;
        let circleColor = colors.circle;
        this.arena = new Arena(x, y, size, mainColor);
        this.player = new Player(x, y, 0.03, mainColor, size / 2);
        this.scoreCircle = new ScoreCircleTimed(x, y, size, circleColor, mainColor,
            1633190400000, 1633968000000);
        this.emitters = [];
        for (let i = 0; i < 8; i++) {
            this.emitters.push(new ArenaEmitter(x, y, 0.09, mainColor, size / 2 + 0.045, 1, i / 8))
        }
    }

    getObjects() {
        return [this.arena, this.scoreCircle, this.player, ...this.emitters];
    }

    setEmitterSpeedSmooth(speed) {
        for (let e of this.emitters) {
            e.setSpeedSmooth(speed);
        }
    }

    tick(dt) {
        for (let obj of this.getObjects()) {
            obj.tick(dt);
        }

        if (Math.random() < dt * 0.1) {
            this.setEmitterSpeedSmooth(-5 + 10 * Math.random());
        }
    }

    render(ctx) {
        //render player last due to layering
        for (let obj of this.getObjects().filter(obj => obj !== this.player)) {
            obj.render(ctx);
        }

        ctx.drawImage(this.logo, W * .5 - H * .125, H * (.25 - .07 / 2), H * .25, H * .13);

        ctx.fillStyle = "#a04000";
        ctx.font = "bold " + (H * 0.06) + "px 'Century Gothic', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(Utils.formatTime(this.scoreCircle.getRemainingSec()), W * .5, H * .4);

        this.player.render(ctx);


        ctx.fillStyle = "#ff8000";
        ctx.font = (H * 0.05) + "px 'Century Gothic', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("Anticipation", W * .01, H * .93);
        ctx.fillText("Countdown by: VeproGames", W * .01, H * .99);
    }
}