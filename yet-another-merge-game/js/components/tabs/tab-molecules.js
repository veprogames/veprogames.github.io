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
        }
    },
    template: `<div class="tab-molecules center">
    <div class="flex-center flex-vertical">
        <div class="flex-evenly flex-center-v gap-l">
            <button @click="prevMolecule()" :disabled="isFirstMolecule" class="button-xxl">
                <i class="fas fa-angle-left"></i>
            </button>
            <molecule :molecule="molecules.currentMolecule"></molecule>
            <button @click="nextMolecule()" v-if="nextMoleculeUnlocked" class="button-xxl">
                <i class="fas fa-angle-right"></i>
            </button>
            <button disabled v-else-if="!isLastMolecule" class="text-xl">🔒<br/>{{nextMoleculeCost | fnum}} <img class="icon" alt="Molecules" src="images/currencies/molecules.png"/></button>
        </div>
        <div class="upgrade-container">
            <upgrade-molecule v-for="(u, i) in molecules.upgrades" :upgrade="u" :key="i"></upgrade-molecule>
        </div>
    </div>
</div>`
});