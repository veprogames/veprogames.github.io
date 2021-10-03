class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.t = 0;
    }

    toScreen(x, y) {
        return GameObject.toScreen(this.x, this.y);
    }

    static toScreen(x2, y2) {
        return { x: (x2 + .5 * W / H) * H, y: (-y2 + .5) * H } //base on H, center is (0, 0)
    }

    tick(dt) {
        this.t += dt;
    }

    render(ctx) {

    }
}