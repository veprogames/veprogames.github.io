class ScoreCircle extends GameObject {
    constructor(x, y, size, innerColor, outerColor) {
        super(x, y);
        this.size = size;
        this.innerColor = innerColor;
        this.outerColor = outerColor;
        this.progress = 0;
    }

    render(ctx) {
        let { x, y } = this.toScreen();

        CanvasUtils.circle(ctx, x, y, this.size / 2 * H * this.progress, 0.002 * H, this.innerColor, this.outerColor);
    }
}