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
    <p v-if="!canBuyMax" class="text-xxl"><i class="fas fa-lock"></i> Prestige once</p>
    <button class="button-l with-icon flex-gap-h" @click="maxMatterUpgrades()" v-if="canBuyMax"><img src="images/currencies/matter.png" alt="(Matter)"/> Max All <div class="key">M</div></button>
    <button class="button-l with-icon flex-gap-h" @click="prestige()" v-if="canBuyMax"><img src="images/currencies/quantumfoam.png" alt="(Matter)"/> Prestige <div class="key">P</div></button>
    <button class="button-l with-icon flex-gap-h" @click="maxQuantumFoamUpgrades()" v-if="canBuyMax"><img src="images/currencies/quantumfoam.png" alt="(Quantum Foam)"/> Max All <div class="key">Q</div></button>
    <button class="button-l with-icon flex-gap-h" @click="selectLowestEnergyCore()" v-if="canSelectEnergyCore"><img src="images/tabs/energycores.png" alt="(Energy Core)"/> Select Best <div class="key">E</div></button>
    <button class="button-l with-icon flex-gap-h" @click="maxIsotopeUpgrades()" v-if="canBuyMaxIsotopes"><img src="images/currencies/isotopes.png" alt="(Isotopes)"/> Max All <div class="key">I</div></button>
    <button class="button-l with-icon flex-gap-h" @click="maxMoleculeUpgrades()" v-if="canBuyMaxMolecules"><img src="images/currencies/molecules.png" alt="(Molecules)"/> Max All <div class="key">O</div></button>
</div>`
});