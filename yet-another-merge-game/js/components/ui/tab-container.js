Vue.component("tab-container", {
    data() {
        return {
            tabs: [
                ["upgrades", "Upgrades", "true", "currencies/matter.png", ""],
                ["abilities", "Click Abilities", "true", "tabs/abilities.png", ""],
                ["prestige", "Prestige", "game.prestige.isUnlocked()", "currencies/quantumfoam.png", "Reach 1e12 Matter"],
                ["energycores", "Energy Cores", "game.prestige.highestQuantumFoam.gte(50000)", "tabs/energycores.png", "Have 50,000 Quantum Foam"],
                ["quantumprocessor", "Quantum Processor", "game.quantumProcessor.isUnlocked()", "tabs/quantumprocessor.png", "Have 100e9 Quantum Foam"],
                ["isotopes", "Isotopes", "game.isotopes.isUnlocked()", "currencies/isotopes.png", "Get a Quantum Processor Core"],
                ["molecules", "Molecules", "game.molecules.isUnlocked()", "currencies/molecules.png", "Reach Merger #420"],
                ["mergepedia", "Mergepedia", "true", "tabs/mergepedia.png", ""],
                ["settings", "Settings", "true", "tabs/settings.png", ""]
            ],
            tabLabel: "" //used for displaying tab name on hover
        }
    },
    methods: {
        tabUnlocked(tab) {
            return eval(tab[2]);
        },
        selectTab(tab) {
            if (this.tabUnlocked(tab)) {
                game.settings.currentTab = tab[0];
            }
        }
    },
    template: `<div class="wrapper flex-start flex-vertical">
    <div class="flex-around flex-wrap">
        <button class="tab" @mouseover="tabLabel = tabUnlocked(t) ? t[1] : t[4]" @mouseout="tabLabel = ''" :class="{locked: !tabUnlocked(t)}" v-for="t in tabs" @click="selectTab(t)">
            <img alt="" v-if="t[3] !== undefined" :src="'images/' + t[3]"/>
            <span v-else>{{t[1].slice(0, 3)}}</span>
        </button>
    </div>
    <div class="selected-tab">
        {{tabLabel}}
    </div>
</div>`
});