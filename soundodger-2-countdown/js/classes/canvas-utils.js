class CanvasUtils {
    static circle(ctx, x, y, r, w, fill, stroke, from = 0, to = 2 * Math.PI) {
        r = Math.max(0, r);
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(x, y, r, from, to);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    static image(ctx, image, x, y, w, h, rotation, scaleX = 1, scaleY = 1) {
        let fw = w * scaleX, fh = h * scaleY;

        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.drawImage(image, -fw / 2, -fh / 2, fw, fh);
        ctx.rotate(-rotation);
        ctx.translate(-x, -y);
    }
}