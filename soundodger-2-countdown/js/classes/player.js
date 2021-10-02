class Player extends GameObject {
    constructor(x, y, size, color, boundary) {
        super(x, y);
        this.size = size;
        this.color = color;
        this.boundary = boundary;
    }

    tick(dt) {
        super.tick(dt);

        this.x = mouse.x;
        this.y = mouse.y;

        let dist = Math.sqrt(this.x ** 2 + this.y ** 2);
        let maxDist = this.boundary - this.size / 2;
        if (dist > maxDist) {
            let a = Math.atan2(this.y, this.x);
            this.x = Math.cos(a) * maxDist;
            this.y = Math.sin(a) * maxDist;
        }
    }

    render(ctx) {
        let { x, y } = this.toScreen();

        CanvasUtils.circle(ctx, x, y, this.size / 2 * H, 0.0025 * H, "white", this.color);
    }
}