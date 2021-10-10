class Arena extends GameObject {
    constructor(x, y, size, color) {
        super(x, y);
        this.size = size;
        this.color = color;
        this.border = 0.005;
    }

    render(ctx) {
        ctx.strokeStyle = this.color;
        let { x, y } = this.toScreen();

        let c1 = this.size / 10 * 1.96 ** (this.t % 0.5);

        for (let c = c1; c < 2; c *= 1.4) {
            CanvasUtils.circle(ctx, x, y, (this.size / 2 - this.size / 10 + c) * H, this.border * .75 * H, "transparent", this.color);
        }

        CanvasUtils.circle(ctx, x, y, this.size / 2 * H, this.border * H, "transparent", this.color);
    }
}