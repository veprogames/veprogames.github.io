class ArenaEmitter extends Emitter {
    constructor(x, y, size, color, dist, speed, offset) {
        super(x, y, size, color);
        this.dist = dist;
        this.speed = speed;
        this.offset = offset;
    }

    tick(dt) {
        super.tick(dt);

        let off = Math.PI * 2 * this.offset;

        this.x = Math.cos(this.t * this.speed + off) * this.dist;
        this.y = Math.sin(this.t * this.speed + off) * this.dist;
    }
}