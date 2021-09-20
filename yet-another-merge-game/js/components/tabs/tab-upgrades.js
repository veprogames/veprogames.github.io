Vue.component("tab-upgrades", {
    data() {
        return {
            upgrades: game.matter.upgrades
        }
    },
    methods: {
        selectClickAbility(ability) {
            game.clickAbility = ability;
        }
    },
    computed: {
        ability() {
            return game.clickAbility;
        }
    },
    template: `<div class="center">
    <table class="upgrades">
        <upgrade-row v-for="(upg, i) in upgrades" :key="i" :upgrade="upg"></upgrade-row>
    </table>
    <h3>Select your Click Ability</h3>
    <button class="button-xl" @click="selectClickAbility(0)" :disabled="ability === 0">Spawn Speed</button>
    <button class="button-xl" @click="selectClickAbility(1)" :disabled="ability === 1">Merger Move Speed</button>
</div>`
});