Vue.component("konva-background", {
    data() {
        return {
            bg: {
                x: 0,
                y: 0,
                width: W,
                height: H,
                fill: "rgb(33, 33, 33)"
            },
            lines: this.getLines(),
            texts: this.getTexts()
        }
    },
    methods: {
        getPxPerYear(){
            return W / (UpdateList.TOTAL_DAYS_SINCE_GD10 / 365.2442);
        },
        getLines(){
            const lines = [];
            const strokeYear = `rgb(55, 55, 55)`, strokeMonth = `rgb(38, 38, 38)`;
            const pxPerYear = this.getPxPerYear();
            const pxPerMonth = pxPerYear / 12;
            for(let x = 0, y = 0; x < W; x += pxPerMonth, y += pxPerMonth) {
                lines.push({
                    points: [x, 0, x, H],
                    stroke: strokeMonth
                });
                lines.push({
                    points: [0, y, W, y],
                    stroke: strokeMonth
                });
            }
            for(let x = 0, y = 0; x < W; x += pxPerYear, y += pxPerYear) {
                lines.push({
                    points: [x, 0, x, H],
                    stroke: strokeYear
                });
                lines.push({
                    points: [0, y, W, y],
                    stroke: strokeYear
                });
            }
            return lines;
        },
        getTexts(){
            const texts = [];
            const pxPerYear = this.getPxPerYear();
            const y = (Math.floor(H / pxPerYear)) * pxPerYear;
            for(let x = 0, i = 0; x < W; x += pxPerYear, i++) {
                if(i >= 1){
                    texts.push({
                        x,
                        y: y - H * 0.03,
                        text: `${i} Years`,
                        padding: 4,
                        fontSize: H * 0.02,
                        fill: `rgb(100, 100, 100)`
                    });
                }
            }
            return texts;
        }
    },
    template: `<v-layer>
        <v-rect :config="bg"></v-rect>
        <v-group>
            <v-line v-for="(l, i) in lines" :key="i" :config="l"></v-line>
        </v-group>
        <v-group>
            <v-text v-for="(t, i) in texts" :key="i" :config="t"></v-text>
        </v-group>
    </v-layer>`
});