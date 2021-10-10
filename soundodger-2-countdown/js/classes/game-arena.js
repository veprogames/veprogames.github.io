// complete arena with arena, emitters and player etc
class GameArena extends GameObject {
    constructor(x, y, size, colors) {
        super(x, y);
        this.size = size;
        this.fact = 0;
        this.logo = new Image();
        this.logo.src = "images/sd2-logo.png";

        let mainColor = colors.main;
        let circleColor = colors.circle;
        this.arena = new Arena(x, y, size, mainColor);
        this.player = new Player(x, y, 0.03, mainColor, size / 2);
        this.scoreCircle = new ScoreCircleTimed(x, y, size, circleColor, mainColor,
            1633190400000, 1633965300000);
        this.emitters = [];
        for (let i = 0; i < 8; i++) {
            this.emitters.push(new ArenaEmitter(x, y, 0.09, mainColor, size / 2 + 0.045, 1, i / 8))
        }
        this.releaseIndicator = null;
        this.cursor = new Cursor(x, y, 0.05);

        this.changeFact();
    }

    static get FACT_COUNT() {
        return 5;
    }

    isReleased() {
        return this.scoreCircle.getRemainingSec() <= 0;
    }

    getObjects() {
        return [this.arena, this.scoreCircle, this.player, ...this.emitters, this.releaseIndicator, this.cursor];
    }

    setEmitterSpeedSmooth(speed) {
        for (let e of this.emitters) {
            e.setSpeedSmooth(speed);
        }
    }

    changeFact() {
        this.fact = Math.floor(Math.random() * GameArena.FACT_COUNT);
    }

    //toggle released state
    release() {
        this.releaseIndicator = new ReleaseIndicator(this.x, this.y + 0.01, this.size * 1.05);
        for (let e of this.emitters) {
            e.fadeOut();
        }
    }

    getFactText(fact) {
        switch (fact) {
            case 0:
                return `Release in: ${(this.scoreCircle.getRemainingSec() / 3587.792).toFixed(3)} Snow Tapes`;
            case 1:
                return `Release in: ${(this.scoreCircle.getRemainingSec() / 133).toFixed(3)} Solvalous`;
            case 2:
                return `Soundodger 2 releases exactly 8 Years after Soundodger+`;
            case 3:
                return `All Songs written by Bean start with 's'`;
            case 4:
                return "Soundodger 2 was first created by copying and pasting code from Soundodger+ into Unity";
            default:
                return "";
        }
    }

    tick(dt) {
        super.tick(dt);

        if (this.isReleased() && !this.releaseIndicator) {
            this.release();
        }

        for (let obj of this.getObjects()) {
            if (obj) {
                obj.tick(dt);
            }
        }

        if (Math.random() < dt * 0.1) {
            this.setEmitterSpeedSmooth(-5 + 10 * Math.random());
        }

        if (Math.random() < dt * 0.05) {
            this.changeFact();
        }
    }

    render(ctx) {
        if (!this.isReleased()) {
            //render player last due to layering
            for (let obj of [this.arena, this.scoreCircle, ...this.emitters]) {
                obj.render(ctx);
            }

            let period = Math.PI * 150 / 120; // 150 BPM (Attract Mode)
            CanvasUtils.image(ctx, this.logo, W * .5, H * .275, H * .25, H * .14,
                Math.sin(this.t * period) * .1, 1, 1 + Math.abs(Math.sin(this.t * period * 2)) * .2);

            ctx.fillStyle = "#a04000";
            ctx.font = "bold " + (H * 0.06) + "px 'Century Gothic', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(Utils.formatTime(this.scoreCircle.getRemainingSec()), W * .5, H * .4);

            this.player.render(ctx);
        }
        else {
            for (let obj of [this.arena, ...this.emitters]) {
                obj.render(ctx);
            }

            this.releaseIndicator.render(ctx);

            this.cursor.render(ctx);
        }

        ctx.fillStyle = "#ff8000";
        ctx.font = (H * 0.05) + "px 'Century Gothic', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("Anticipation", W * .01, H * .93);
        ctx.fillText("Countdown by: VeproGames", W * .01, H * .99);

        if (!this.isReleased()) {
            ctx.font = (H * 0.03) + "px 'Century Gothic', sans-serif";
            ctx.textAlign = "right";
            ctx.textBaseline = "top";
            ctx.fillText(this.getFactText(this.fact), W * .99, H * .01, W * 0.8);
        }
    }
}