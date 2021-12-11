Vue.component("tab-upgrades", {
    data() {
        return {
            upgrades: game.matter.upgrades
        }
    },
    computed: {
        matter() {
            return game.matter.amount;
        }
    },
    template: `<div class="center">
    <div class="upgrade-container">
        <upgrade-matter v-for="(upg, i) in upgrades" :key="i" :upgrade="upg"></upgrade-matter>
    </div>
</div>`
});