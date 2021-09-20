Vue.component("tab-molecules", {
    data() {
        return {
            molecules: game.molecules
        }
    },
    methods: {
        prevMolecule() {
            if (this.moleculeIndex > 0) {
                this.molecules.setMolecule(--this.molecules.moleculeIdx);
            }
        },
        nextMolecule() {
            if (!this.isLastMolecule) {
                this.molecules.setMolecule(++this.molecules.moleculeIdx);
            }
        }
    },
    computed: {
        moleculeIndex() {
            return this.molecules.moleculeIdx;
        },
        moleculeAmount() {
            return this.molecules.molecules.length;
        },
        isFirstMolecule() {
            return this.moleculeIndex === 0;
        },
        isLastMolecule() {
            return this.moleculeIndex >= this.moleculeAmount - 1;
        },
        nextMoleculeUnlocked() {
            return !this.isLastMolecule && this.molecules.molecules[this.moleculeIndex + 1].isUnlocked();
        },
        nextMoleculeCost() {
            return !this.isLastMolecule ? this.molecules.molecules[this.moleculeIndex + 1].moleculesNeeded : new Decimal(0);
        },
        moleculePower() {
            return game.molecules.getMoleculePower();
        }
    },
    template: `<div class="tab-molecules center">
    <p>You have <span class="title">{{molecules.amount | fnum}} <img class="icon" alt="Molecules" src="images/tabs/molecules.png"/></span></p>
    <div class="flex-center padding-h-xxl">
        <div class="molecule-selection flex-around flex-center-v flex-vertical margin">
            <div class="selection flex-around flex-center-v padding-v">    
                <button @click="prevMolecule()" v-if="!isFirstMolecule" class="with-icon button-xl">
                    <img src="images/icons/back.svg"></img>
                </button>
                <span v-else></span>
                <button @click="nextMolecule()" v-if="nextMoleculeUnlocked" class="with-icon button-xl">
                    <img src="images/icons/forward.svg"></img>
                </button>
                <span v-else-if="!isLastMolecule">🔒 {{nextMoleculeCost | fnum}} <img class="icon" alt="Molecules" src="images/tabs/molecules.png"/></span>
                <span v-else></span>
            </div>
            <molecule :molecule="molecules.currentMolecule"></molecule>
        </div>
        <table class="upgrades molecules margin">
            <tr>
                <th>Each Upgrade multiplies the Merges needed per Molecule Level by x0.99 (softcapped)</th>
                <th></th>
                <th>Each Molecule Level adds +^0.0001 (max ^10) to its power, affecting all Molecules (multiplied together).<br/> Currently: ^{{moleculePower | fnum(2, 4)}}</th>
            </tr>
            <upgrade-row v-for="(upg, i) in molecules.upgrades" :key="i" :upgrade="upg"></upgrade-row>
        </table>
    </div>
</div>`
});