class Emitter extends GameObject {
    constructor(x, y, size, color) {
        super(x, y);
        this.size = size;
        this.targetSize = size;
        this.color = color;
    }

    fadeOut() {
        this.targetSize = 0;
    }

    tick(dt) {
        super.tick(dt);

        this.size += (this.targetSize - this.size) * dt * 4;
        this.size = Math.max(this.size, 0);
    }

    render(ctx) {
        let { x, y } = this.toScreen();
        CanvasUtils.circle(ctx, x, y, this.size / 2 * H, 0.005 * H, "white", this.color);
    }
}