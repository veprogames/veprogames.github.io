class Player extends GameObject {
    constructor(x, y, size, color, boundary) {
        super(x, y);

        //use this for positions outside the arena
        this.realX = x;
        this.realY = y;

        this.size = size;
        this.color = color;
        this.boundary = boundary;
    }

    getDistanceToCenter() {
        return Math.sqrt(this.realX ** 2 + this.realY ** 2);
    }

    getMaxDistance() {
        return this.boundary - this.size / 2;
    }

    isOutOfBounds() {
        return this.getDistanceToCenter() > this.getMaxDistance();
    }

    tick(dt) {
        super.tick(dt);

        this.x = mouse.x;
        this.y = mouse.y;
        this.realX = mouse.x;
        this.realY = mouse.y;

        let maxDist = this.getMaxDistance();
        if (this.isOutOfBounds()) {
            let a = Math.atan2(this.y, this.x);
            this.x = Math.cos(a) * maxDist;
            this.y = Math.sin(a) * maxDist;
        }
    }

    render(ctx) {
        let { x, y } = this.toScreen();
        let real = GameObject.toScreen(this.realX, this.realY);

        CanvasUtils.circle(ctx, x, y, this.size / 2 * H, 0.0025 * H, "white", this.color);

        if (this.isOutOfBounds()) {
            for (let a = this.t; a < 2 * Math.PI + this.t; a += Math.PI / 4) {
                CanvasUtils.circle(ctx, real.x, real.y, this.size / 2 * H, 0.005 * H, "white", this.color, a, a + Math.PI / 8);
            }
        }
    }
}