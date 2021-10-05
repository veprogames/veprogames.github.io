class ReleaseIndicator extends GameObject {
    constructor(x, y, size) {
        super(x, y);
        this.size = size;
        this.image = new Image();
        this.image.src = "images/release.png";
    }

    render(ctx) {
        let { x, y } = this.toScreen();
        let t2 = Math.min(2, this.t);
        let rotation = -4 + t2 * 2;
        let scale = (t2 / 2) ** 2;
        CanvasUtils.image(ctx, this.image, x, y, this.size * H, this.size * H,
            rotation, scale, scale);
    }
}