class GameBackground {
    constructor() {
        this.backgrounds = [
            {
                level: 0,
                fontColor: "#000000",
                topBarColor: "#6fdeff"
            },
            {
                level: 49,
                fontColor: "#000000",
                topBarColor: "#22c2f0"
            },
            {
                level: 149,
                fontColor: "#000000",
                topBarColor: "#00b1f0"
            },
            {
                level: 249,
                fontColor: "#000000",
                topBarColor: "#97b4f8"
            },
            {
                level: 499,
                fontColor: "#000000",
                topBarColor: "#6e6efa"
            },
            {
                level: 999,
                fontColor: "#000000",
                topBarColor: "#c9c9ff"
            },
            {
                level: 1499,
                fontColor: "#000000",
                topBarColor: "#fffac5"
            },
            {
                level: 1999,
                fontColor: "#000000",
                topBarColor: "#dfd7aa"
            },
            {
                level: 2999,
                fontColor: "#000000",
                topBarColor: "#897846"
            },
            {
                level: 4999,
                fontColor: "#000000",
                topBarColor: "#c3bba5"
            },
            {
                level: 9999,
                fontColor: "#000000",
                topBarColor: "#ffffff"
            }
        ];
    }

    getBGData() {
        let mergerLvl = game.highestMergeObjectThisPrestige;
        let milestone;
        for (let m = 0; m < this.backgrounds.length; m++) {
            if (mergerLvl >= this.backgrounds[m].level) {
                milestone = this.backgrounds[m];
                milestone.index = m;
            }
        }
        return milestone;
    }

    getFontColor() {
        return this.getBGData().fontColor;
    }

    getTopBarColor() {
        return this.getBGData().topBarColor;
    }

    render(ctx) {
        let bg = this.getBGData();
        ctx.drawImage(images.bgs[bg.index], 0, 0, w, h);
        ctx.drawImage(images.bgVignette, 0, 0, w, h);
    }
}