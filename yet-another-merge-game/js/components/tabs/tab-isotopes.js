Vue.component("tab-isotopes", {
    data() {
        return {
            upgrades: game.isotopes.upgrades
        }
    },
    template: `<div>
    <div class="upgrade-container">
        <upgrade-isotope v-for="(upg, i) in upgrades" :key="i" :upgrade="upg"></upgrade-isotope>
    </div>
</div>`
});