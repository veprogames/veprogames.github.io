class Emitter extends GameObject {
    constructor(x, y, size, color) {
        super(x, y);
        this.size = size;
        this.color = color;
    }

    render(ctx) {
        let { x, y } = this.toScreen();
        CanvasUtils.circle(ctx, x, y, this.size / 2 * H, 0.0025 * H, "white", this.color);
    }
}