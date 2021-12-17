Vue.component("tab-quantum-processors", {
    data() {
        return {
            cores: game.quantumProcessor.cores
        }
    },
    methods: {
        buyProcessorCore() {
            windowManager.createWindow(CoreResetWindowComponent);
        }
    },
    computed: {
        hasCores() {
            return this.cores.length >= 1;
        },
        nextCorePrice() {
            return game.quantumProcessor.getProcessorCorePrice();
        },
        canAffordCore() {
            return new Decimal(game.quantumProcessor.getProcessorCorePrice()).lte(game.prestige.quantumFoam);
        }
    },
    template: `<div class="center">
    <div class="flex-evenly flex-wrap padding-h-xxl" style="margin-bottom: 3rem;">
        <processor-core class="processorcore" v-for="(core, i) in cores" :key="i" :core="core"></processor-core>
    </div>
    <button v-if="cores.length < 5" :disabled="!canAffordCore" class="with-icon buy padding margin-v-l" :class="{'cant-afford': !canAffordCore}" @click="buyProcessorCore()">Add Core<br/>
        <img alt="Quantum Foam " src="images/currencies/quantumfoam.png"/> {{nextCorePrice | fnum}}</button>
</div>`
});