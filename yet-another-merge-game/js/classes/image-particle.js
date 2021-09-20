class ImageParticle{
    constructor(image, x, y) {
        this.x = x;
        this.y = y;
        this.vx = -0.06 + 0.12 * Math.random();
        this.vy = -0.25 - 0.15 * Math.random();
        this.gravity = 0.9;
        this.image = image;
        this.scale = 0.08 + 0.04 * Math.random();
    }

    tick(dt) {
        this.vy += this.gravity * dt;
        this.y += this.vy * h * dt;
        this.x += this.vx * h * dt;
        this.scale /= 3 ** dt;
        if(this.scale < 0.01){
            particles = particles.filter(p => p !== this);
        }
    }

    render(ctx) {
        let s = this.scale * h;
        ctx.drawImage(this.image, this.x - s / 2, this.y - s / 2, s, s);
    }

    static create(image, x, y){
        particles.push(new ImageParticle(image, x, y));
    }
}