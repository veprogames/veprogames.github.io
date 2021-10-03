class ArenaEmitter extends Emitter {
    constructor(x, y, size, color, dist, speed, offset) {
        super(x, y, size, color);
        this.dist = dist;
        this.speed = speed;
        this.targetSpeed = speed;
        this.offset = offset;

        this.position = Math.PI * 2 * offset;
    }

    setSpeed(speed) {
        this.speed = speed;
        this.targetSpeed = speed;
    }

    setSpeedSmooth(speed) {
        this.targetSpeed = speed;
    }

    tick(dt) {
        super.tick(dt);

        this.speed += (this.targetSpeed - this.speed) * dt * 4; //interpolate

        this.position += this.speed * dt;

        this.x = Math.cos(this.position) * this.dist;
        this.y = Math.sin(this.position) * this.dist;
    }
}