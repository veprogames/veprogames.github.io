class UpdateBar {
    //time in days
    constructor(title, days, x, y, hue) {
        this.days = days;
        this.title = title;
        this.x = x;
        this.y = y;
        const height = this.getBarHeight();
        this.konva = {
            group: {
                draggable: true,
                onMouseEnter: () => container.style.cursor = "move",
                onMouseLeave: () => container.style.cursor = "default"
            },
            rect: {
                x: this.x,
                y: this.y,
                width: this.getBarWidth(),
                height,
                fill: `hsl(${hue}deg, 100%, 80%)`,
                stroke: `hsl(${hue}deg, 100%, 10%)`,
                strokeWidth: 4,
            },
            text: {
                text: this.title,
                x: this.x + 4,
                y: this.y,
                height,
                fontFamily: "Oxygene1",
                fill: this.getFontColor(hue),
                stroke: "black",
                strokeWidth: 2,
                fontSize: this.getFontSize(),
                verticalAlign: 'middle'
            }
        };
    }

    getFontColor(hue){
        return `hsl(${hue}deg, 100%, 65%)`;
    }

    getBarHeight(){
        return H * 0.05;
    }

    getBarWidth(){
        return this.days * W / UpdateBar.TOTAL_DAYS_SINCE_GD10;
    }

    getFontSize(){
        return Math.max(this.getBarHeight() * 0.8, Math.min(this.getBarHeight(), this.getBarWidth()));
    }

    static get BASE_DATE(){
        return Date.parse("2013-08-13");
    }

    static get TOTAL_DAYS_SINCE_GD10(){
        return (Date.now() - UpdateBar.BASE_DATE) / (86400 * 1000);
    }

    static createFromReleaseDates(updates) {
        let x = 0;
        let i = 0;
        const bars = [];
        const differences = updates.getDifferenceList();
        for (const update of updates.updates) {
            const bar = new UpdateBar(update.name, differences[i], x, H / 2, 30 * i);
            bars.push(bar);
            x += bar.konva.rect.width;
            i++;
        }
        return bars;
    }
}

Vue.component("update-bar", {
    props: ["updatebar"],
    template: `<v-group :config="updatebar.konva.group">
        <v-rect :config="updatebar.konva.rect"></v-rect>
        <v-text :config="updatebar.konva.text"></v-text>
    </v-group>`
});