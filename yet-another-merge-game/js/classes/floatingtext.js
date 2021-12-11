class FloatingText {
    constructor(text, x, y, vy, cfg) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.lifeTime = 0;
        this.maxTime = 1.25;
        this.color = cfg && cfg.color ? cfg.color : "#000000";
        this.size = cfg && cfg.size ? cfg.size : h * 0.05;
    }

    tick(delta) {
        this.y -= delta * this.vy * Math.max(0, 1 - this.lifeTime / this.maxTime);
        this.lifeTime += delta;
    }

    draw(ctx) {
        let alpha = Math.max(0, 1 - this.lifeTime / this.maxTime);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let sizeMod = Math.min(1, Math.pow(this.lifeTime * 4, 1.5));
        ctx.font = "bold " + (this.size * sizeMod) + "px 'Helvetica Rounded', Arial, sans-serif";
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}