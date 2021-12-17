class UpdateLengthComparision{
    constructor(updates){
        this.updates = updates;
        this.data = [];
        let i = 0;
        let last = null;
        const differences = updates.getDifferenceList();
        for(const update of updates.updates){
            const diff = differences[i];
            this.data.push({
                name: update.name,
                previousName: last ? last.name : "none",
                days: diff,
                quotient: last ? diff / differences[i - 1] : 0
            });
            last = update;
            i++;
        }
    }
}

Vue.component("length-comparision", {
    props: {info: UpdateLengthComparision},
    methods: {
        getText(){
            let text = "";
            for(let i = 0; i < this.info.data.length; i++){
                const {name, previousName, days, quotient} = this.info.data[i];
                if(i === 0){
                    text += `${name} took ${days.toFixed(0)} days\n`;
                }
                else{
                    const soFar = i === this.info.data.length - 1 ? "so far" : "";
                    text += `${name} took ${quotient.toFixed(2)}x as long as ${previousName} ${soFar} (${days.toFixed(0)} days)\n`
                }
            }
            return text;
        }
    },
    data(){
        return {
            config: {
                x: 16,
                y: 16,
                draggable: true,
                onMouseEnter: () => container.style.cursor = "move",
                onMouseLeave: () => container.style.cursor = "default"
            },
            rect: {
                width: W * 0.4,
                height: W * 0.25,
                fill: `rgba(0, 0, 0, 0.35)`,
            },
            text: {
                text: this.getText(),
                fill: "white",
                stroke: "black",
                strokeWidth: 1,
                padding: 8,
                width: W * 0.4,
                height: W * 0.25,
                fontSize: H * 0.02,
                fontFamily: "Pusab"
            }
        };
    },
    template: `<v-group :config="config">
        <v-rect :config="rect"></v-rect>
        <v-text :config="text"></v-text>
    </v-group>`,
});