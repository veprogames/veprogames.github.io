class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.t = 0;
    }

    toScreen() {
        return { x: (this.x + .5 * W / H) * H, y: (-this.y + .5) * H } //base on H, center is (0, 0)
    }

    tick(dt) {
        this.t += dt;
    }

    render(ctx) {

    }
}