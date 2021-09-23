//contains handy shortcuts like max all
Vue.component("utility-container", {
    methods: {
        maxMatterUpgrades() {
            functions.maxUpgrades(game.matter.amount, game.matter.upgrades);
        },
        prestige() {
            game.prestige.prestige();
        },
        maxQuantumFoamUpgrades() {
            functions.maxUpgrades(game.prestige.quantumFoam, game.prestige.upgrades);
        },
        maxIsotopeUpgrades() {
            functions.maxUpgrades(game.isotopes.amount, game.isotopes.upgrades);
        },
        maxMoleculeUpgrades() {
            functions.maxUpgrades(game.molecules.amount, game.molecules.upgrades);
        },
        selectLowestEnergyCore: () => game.energyCores.selectMostEfficientEnergyCore()
    },
    computed: {
        canBuyMax() {
            return game.prestige.hasPrestiged();
        },
        canSelectEnergyCore() {
            return !game.energyCores.cores[0].locked;
        },
        canBuyMaxIsotopes() {
            return game.isotopes.isUnlocked();
        },
        canBuyMaxMolecules() {
            return game.molecules.isUnlocked();
        }
    },
    template: `<div class="flex-start flex-vertical flex-gap padding">
    <p v-if="!canBuyMax" class="text-xxl">🔒 Prestige once</p>
    <button class="button-l" @click="maxMatterUpgrades()" v-if="canBuyMax"><img class="icon" src="images/currencies/matter.png" alt="(Matter)"/> Max All <span class="key">M</span></button>
    <button class="button-l" @click="prestige()" v-if="canBuyMax"><img class="icon" src="images/currencies/quantumfoam.png" alt="(Matter)"/> Prestige <span class="key">P</span></button>
    <button class="button-l" @click="maxQuantumFoamUpgrades()" v-if="canBuyMax"><img class="icon" src="images/currencies/quantumfoam.png" alt="(Quantum Foam)"/> Max All <span class="key">Q</span></button>
    <button class="button-l" @click="selectLowestEnergyCore()" v-if="canSelectEnergyCore"><img class="icon" src="images/tabs/energycores.png" alt="(Energy Core)"/> Select Efficient <span class="key">E</span></button>
    <button class="button-l" @click="maxIsotopeUpgrades()" v-if="canBuyMaxIsotopes"><img class="icon" src="images/currencies/isotopes.png" alt="(Isotopes)"/> Max All <span class="key">I</span></button>
    <button class="button-l" @click="maxMoleculeUpgrades()" v-if="canBuyMaxMolecules"><img class="icon" src="images/tabs/molecules.png" alt="(Molecules)"/> Max All <span class="key">O</span></button>
</div>`
});