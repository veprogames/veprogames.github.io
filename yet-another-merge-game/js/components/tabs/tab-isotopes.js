Vue.component("tab-isotopes", {
    data() {
        return {
            upgrades: game.isotopes.upgrades
        }
    },
    computed: {
        isotopes() {
            return game.isotopes.amount;
        }
    },
    template: `<div>
    <p>You have <span class="title">{{isotopes | ftnum}}<img alt="Isotopes" class="icon" src="images/currencies/isotopes.png"/></span></p>
    <table class="upgrades isotopes center">
        <upgrade-row v-for="(upg, i) in upgrades" :key="i" :upgrade="upg"></upgrade-row>
    </table>
</div>`
});