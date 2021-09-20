Vue.component("tab-quantum-processors", {
    data() {
        return {
            cores: game.quantumProcessor.cores
        }
    },
    methods: {
        buyProcessorCore() {
            if (game.quantumProcessor.cores.length < 5 && game.prestige.quantumFoam.gte(game.quantumProcessor.getProcessorCorePrice())) {
                if (confirm("Buying a Quantum Processor Core will boost all Matter production by x25," +
                    "but current Matter, Matter Upgrades, Prestige Upgrades and Quantum Foam will be lost. Are you sure?")) {
                    game.mergeObjects = [];
                    game.matter.amount = new Decimal(0);
                    game.matter.amountThisPrestige = new Decimal(0);
                    game.highestMergeObjectThisPrestige = 0;
                    game.quantumProcessor.cores.push(new ProcessorCore());
                    game.prestige.quantumFoam = new Decimal(0);
                    game.prestige.bankedQuantumFoam = new Decimal(0);
                    for (let k of Object.keys(game.matter.upgrades)) {
                        game.matter.upgrades[k].level = 0;
                    }
                    for (let k of Object.keys(game.prestige.upgrades)) {
                        game.prestige.upgrades[k].level = 0;
                    }
                }
            }
        }
    },
    computed: {
        isotopes() {
            return game.isotopes.amount;
        },
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
    <div class="flex-start flex-wrap padding-h-xxl" style="margin-bottom: 3rem;">
        <processor-core class="processorcore" v-for="(core, i) in cores" :key="i" :core="core"></processor-core>
    </div>
    <span>Each Quantum Processing Core gives a <span class="text-xl">25x</span> Boost to Matter produced.</span>
    <span v-if="hasCores">
        Upgrade Cores by spending Isotopes to increase their boost.
        You have <span class="text-xl">{{isotopes | ftnum}}<img alt="Isotopes" class="icon" src="images/currencies/isotopes.png"/></span>
    </span><br/>
    <button v-if="cores.length < 5" :disabled="!canAffordCore" :class="{'cant-afford': !canAffordCore}" class="buy-processor padding margin-v-l" @click="buyProcessorCore()">Add Core<br/>
        <img alt="" class="icon" src="images/currencies/quantumfoam.png"/> {{nextCorePrice | fnum}}</button>
</div>`
});