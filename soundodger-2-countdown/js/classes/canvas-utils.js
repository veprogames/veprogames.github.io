class CanvasUtils {
    static circle(ctx, x, y, r, w, fill, stroke, from = 0, to = 2 * Math.PI) {
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(x, y, r, from, to);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}