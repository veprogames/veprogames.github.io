Vue.component("mergepedia-entry", {
    methods: {
        production(level) {
            return MergeObject.calculateOutputForLevel(level);
        },
        baseProduction(level) {
            return MergeObject.getBaseProduction(level);
        }
    },
    computed: {
        highestMergeObjectThisPrestige: () => game.highestMergeObjectThisPrestige
    },
    props: ["level"],
    template: `<tr class="center entry"
     :class="{reached: level <= highestMergeObjectThisPrestige}">
    <td class="flex-center-center">
        <merger :level="level"></merger> <span>(# {{(level + 1) | ftnum}})</span>
    </td>
    <td>
        <span>{{production(level) | fnum}}</span>
    </td>
    <td>
        <span>{{baseProduction(level) | fnum}}</span>
    </td>
</tr>`});