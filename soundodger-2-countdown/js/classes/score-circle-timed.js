class ScoreCircleTimed extends ScoreCircle {
    constructor(x, y, size, innerColor, outerColor, from, to) {
        super(x, y, size, innerColor, outerColor);
        this.from = from;
        this.to = to;
    }

    getRemainingSec() {
        return (this.to - Date.now()) / 1000;
    }

    tick(dt) {
        super.tick(dt);

        this.progress = (Date.now() - this.from) / (this.to - this.from);
        this.progress = Math.min(1, Math.max(0, this.progress));
    }
}