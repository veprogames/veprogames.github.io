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
            Date.parse("2021-10-02 18:00 UTC+2"), Date.parse("2021-10-11 8:00 PST"));
        this.emitters = [];
        for (let i = 0; i < 8; i++) {
            this.emitters.push(new ArenaEmitter(x, y, 0.09, mainColor, size / 2, 1, i / 8))
        }
    }

    getObjects() {
        return [this.arena, this.scoreCircle, this.player, ...this.emitters];
    }

    tick(dt) {
        for (let obj of this.getObjects()) {
            obj.tick(dt);
        }
    }

    render(ctx) {
        ctx.drawImage(this.logo, W * .5 - H * .125, H * (.25 - .07 / 2), H * .25, H * .13);

        ctx.fillStyle = "#404040";
        ctx.font = "bold " + (H * 0.06) + "px Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(Utils.formatTime(this.scoreCircle.getRemainingSec()), W * .5, H * .4);

        for (let obj of this.getObjects()) {
            obj.render(ctx);
        }
    }
}