function loadImage(path) {
    let img = new Image();
    return new Promise(resolve => {
        img.onload = () => {
            resolve(img);
        }

        img.src = path;
    });
}

function loadImageSync(path) {
    let img = new Image();
    img.src = path;
    return img;
}

class CanvasUtils {
    static async loadImages() {
        return {
            bgs: [
                await loadImage("images/bgs/1.png"),
                await loadImage("images/bgs/2.png"),
                await loadImage("images/bgs/3.png"),
                await loadImage("images/bgs/4.png"),
                await loadImage("images/bgs/5.png"),
                await loadImage("images/bgs/6.png"),
                await loadImage("images/bgs/7.png"),
                await loadImage("images/bgs/8.png"),
                await loadImage("images/bgs/9.png"),
                await loadImage("images/bgs/10.png"),
                await loadImage("images/bgs/11.png")
            ],
            bgVignette: await loadImage("images/bgvignette.png"),
            progress: await loadImage("images/progress.png"),
            currencies: {
                quantumFoam: await loadImage("images/currencies/quantumfoam.png"),
                energyCores: await loadImage("images/tabs/energycores.png"),
                quantumProcessor: await loadImage("images/tabs/quantumprocessor.png"),
                isotopes: await loadImage("images/currencies/isotopes.png"),
                molecules: await loadImage("images/currencies/molecules.png")
            },
            particles: {
                speed: await loadImage("images/particles/speed.png")
            },
            merger: await loadImage("images/merger/merger.png")
        }
    }

    static getFont() {
        return getComputedStyle(document.body).getPropertyValue("font");
    }

    static getFontFamily() {
        return getComputedStyle(document.body).getPropertyValue("font-family");
    }

    static drawText(ctx, text, x, y, size, color = "black", halign = "center", valign = "center", maxWidth = undefined, stroke = 0) {
        ctx.textAlign = halign;
        ctx.textBaseline = valign;
        let fontSize = (size);
        ctx.font = fontSize + "px " + CanvasUtils.getFontFamily();
        ctx.fillStyle = color;
        if (stroke > 0) {
            ctx.lineWidth = stroke * fontSize;
            ctx.strokeText(x, y, maxWidth);
        }
        ctx.fillText(text, x, y, maxWidth);
    }

    static drawTextOutline(ctx, text, x, y, size, stroke, color = "black", halign = "center", valign = "center", maxWidth = Infinity) {
        CanvasUtils.drawText(text, x, y, size, color, halign, valign, maxWidth, stroke);
    }

    static drawProgressBar(ctx, x, y, w, h, progress, background, foreground) {
        let imageWidth = Math.max(1, w * progress); //amount of pixels on x axis
        ctx.fillStyle = background;
        ctx.fillRect(x, y, w, h);
        if (typeof (foreground) === "string") { //assume css color
            ctx.fillStyle = foreground;
            ctx.fillRect(x, y, w * progress, h);
        }
        else { //assume image
            let px = Utils.clamp(progress, 0, 1) * foreground.width;
            px = Utils.clamp(px, 1, foreground.width - 1); //prevent error on certain browsers?
            ctx.drawImage(images.progress, 0, 0, px, foreground.height, //crop (0, 0, progress, height) of image
                x, y, imageWidth, h); //draw image
        }
    }
}