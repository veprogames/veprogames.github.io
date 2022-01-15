Vue.component("resource-overview", {
    computed: {
        tab() {
            return game.settings.currentTab;
        },
        matter() {
            return game.matter.amount;
        },
        quantumFoam() {
            return game.prestige.quantumFoam;
        },
        bankedQuantumFoam() {
            return game.prestige.bankedQuantumFoam;
        },
        foamBoost() {
            return game.prestige.getQuantumFoamBoost();
        },
        energyCoreBoost() {
            return game.energyCores.getCoreBoost();
        },
        processorCoreBoost() {
            return game.quantumProcessor.getProcessorBoost();
        },
        isotopes() {
            return game.isotopes.amount;
        },
        molecules() {
            return game.molecules.amount;
        },
        highestMerger() {
            return game.highestMergeObject + 1;
        },
        moleculePower() {
            return game.molecules.getMoleculePower();
        },
        moleculePower() {
            return game.molecules.getMoleculePower();
        },
        mergeReduction() {
            return game.molecules.getMergeReduction();
        }
    },
    template: `<div class="resource-view">
        <resource-view v-if="tab === 'upgrades'" icon="images/currencies/matter.png">{{matter | fnum}}</resource-view>
        <resource-view v-if="tab === 'prestige'" icon="images/currencies/quantumfoam.png">{{quantumFoam | fnum}}</resource-view>
        <resource-view v-if="tab === 'prestige'" icon="images/currencies/quantumfoam-banked.png">{{bankedQuantumFoam | fnum}}</resource-view>
        <resource-view v-if="tab === 'prestige'" icon="images/currencies/matter.png">x{{foamBoost | fnum(2, 2)}}</resource-view>
        <resource-view v-if="tab === 'energycores'" icon="images/currencies/matter.png">x{{energyCoreBoost | fnum}}</resource-view>
        <resource-view v-if="tab === 'quantumprocessor'" icon="images/currencies/matter.png">x{{processorCoreBoost | fnum}}</resource-view>
        <resource-view v-if="tab === 'isotopes' || tab === 'quantumprocessor'" icon="images/currencies/isotopes.png">{{isotopes | fnum(2, 0, 1e9)}}</resource-view>
        <resource-view v-if="tab === 'molecules'" icon="images/currencies/molecules.png">{{molecules | fnum}}</resource-view>
        <resource-view v-if="tab === 'molecules'" icon="images/currencies/molecules.png">^{{moleculePower | fnum(3, 4)}}</resource-view>
        <resource-view v-if="tab === 'molecules'" icon="images/currencies/molecules.png">x{{mergeReduction | fnum(3, 4)}}</resource-view>
        <resource-view v-if="tab === 'mergepedia'" icon="images/tabs/mergepedia.png">#{{highestMerger | ftnum}}</resource-view>
    </div>`
});