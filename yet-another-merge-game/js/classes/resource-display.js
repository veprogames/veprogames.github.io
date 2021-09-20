class ResourceDisplay{
    constructor(image, x, y, getText, isVisible) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.getText = getText;
        if(isVisible) this.isVisible = isVisible;
    }

    isVisible(){
        return true;
    }

    render(ctx) {
        if(this.isVisible()){
            ctx.fillStyle = "#00000080";
            ctx.fillRect(this.x + w * 0.03, this.y + w * 0.01, w * 0.3, w * 0.04);
            ctx.fillStyle = "#00000040";
            ctx.fillRect(this.x + w * 0.03, this.y + w * 0.03, w * 0.3, w * 0.02);
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText(this.getText(), this.x + w * 0.065, this.y + w * 0.03, w * 0.25);
            ctx.drawImage(this.image, this.x, this.y, w * 0.06, w * 0.06);
        }
    }
}