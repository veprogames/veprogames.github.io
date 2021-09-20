Vue.component("mergepedia-entry", {
    methods: {
        production(level) {
            return MergeObject.calculateOutputForLevel(level);
        }
    },
    computed:{
        highestMergeObjectThisPrestige: () => game.highestMergeObjectThisPrestige,
        fontSize() {
            let c = Math.max(0, functions.formatNumber(this.production(this.level)).length - 8);
            return (100 / (1 + 0.125 * c)) + "%";
        }
    },
    props: ["level"],
    template: `<div class="center entry"
     :class="{reached: level <= highestMergeObjectThisPrestige}">
    <merger :level="level"></merger><br/>
    <span :style="{fontSize}">{{production(level) | fnum}}</span>
</div>`
});