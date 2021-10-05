class Cursor extends GameObject {
    constructor(x, y, size) {
        super(x, y);
        this.size = size;
        this.image = new Image();
        this.image.src = "images/cursor.png";
    }

    tick(dt) {
        super.tick(dt);

        this.x = mouse.x;
        this.y = mouse.y;
    }

    render(ctx) {
        let { x, y } = this.toScreen();
        CanvasUtils.image(ctx, this.image, x, y, this.size * H, this.size * H, 0, 1, 1.2);
    }
}