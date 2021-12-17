class UpdateTimeGraph{
    constructor(updates){
        this.times = updates.getDifferenceList();
        this.oldest = updates.updates[0].name;
        this.newest = updates.updates[updates.updates.length - 1].name;
    }
}

Vue.component("update-time-graph", {
    data(){
        return {
            size: W * 0.25,
            line: this.getLine(),
            group: {
                x: W * 0.75 - 16,
                y: 16,
                draggable: true,
                onMouseEnter: () => container.style.cursor = "move",
                onMouseLeave: () => container.style.cursor = "default"
            },
            rect: {
                width: W * 0.25,
                height: W * 0.25,
                fill: `rgba(0, 0, 0, 0.35)`,
            },
            textTitle: {
                text: "Update Dev Time Evolution",
                fontFamily: "Pusab",
                x: 0,
                y: 4,
                width: W * 0.25,
                fontSize: W * 0.015,
                align: "center",
                fill: "white"
            },
            textOld: {
                text: this.data.oldest,
                fontFamily: "Pusab",
                x: 4,
                y: W * 0.22,
                fontSize: W * 0.02,
                fill: "white"
            },
            textNew: {
                text: this.data.newest,
                fontFamily: "Pusab",
                x: W * 0.21,
                y: W * 0.22,
                fontSize: W * 0.02,
                fill: "white"
            }
        }
    },
    methods: {
        getLine(){
            const points = [];
            const L = this.data.times.length;
            const max = this.data.times.reduce((a, b) => Math.max(a, b));
            const padding = this.size / 10;

            for(let i = 0; i < L; i++){
                points.push(padding + i / L * (this.size - padding * 2), this.size - padding - this.data.times[i] * (this.size - 2 * padding) / max);
            }

            return {
                width: this.size,
                height: this.size,
                points,
                tension: 0.5,
                stroke: "white",
                strokeWidth: 3
            };
        }
    },
    mounted(){
        this.line = this.getLine();
    },
    props: {data: UpdateTimeGraph},
    template: `<v-group :config="group">
        <v-rect :config="rect"></v-rect>
        <v-line :config="line"></v-line>
        <v-text :config="textTitle"></v-text>
        <v-text :config="textOld"></v-text>
        <v-text :config="textNew"></v-text>
    </v-group>`
});