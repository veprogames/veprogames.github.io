const CoreResetWindowComponent = WindowComponent.extend({
    name: "CoreResetWindowComponent",
    methods: {
        buyProcessorCore() {
            if (this.canBuy) {
                game.mergeObjects = [];
                game.matter.amount = new Decimal(0);
                game.matter.amountThisPrestige = new Decimal(0);
                game.highestMergeObjectThisPrestige = 0;
                game.quantumProcessor.cores.push(new ProcessorCore());
                game.prestige.quantumFoam = new Decimal(0);
                game.prestige.bankedQuantumFoam = new Decimal(0);
                for (let k of Object.keys(game.matter.upgrades)) {
                    game.matter.upgrades[k].setLevel(0);
                }
                for (let k of Object.keys(game.prestige.upgrades)) {
                    game.prestige.upgrades[k].setLevel(0);
                }
                this.close();
            }
        }
    },
    computed: {
        canBuy() {
            return game.quantumProcessor.cores.length < 5 && game.prestige.quantumFoam.gte(game.quantumProcessor.getProcessorCorePrice());
        }
    },
    template: `<window icon="images/tabs/quantumprocessor.png" title="Are you sure?">
        <div class="text-xl">
            <p class="title with-icon">+1 <img src="images/tabs/quantumprocessor.png"/> <i class="fas fa-arrow-right"></i> <img src="images/currencies/matter.png"/> x25</p>
            <p class="margin-v-l">Buying a Quantum Processor Core will boost all Matter production by x25. 
                You will lose all Matter, Matter Upgrades, Prestige Upgrades and Quantum Foam (so basically all up until this point).</p>
            <p class="title">Are you sure?</p>
        </div>
        <div class="footer-buttons">
            <button :disabled="!canBuy" class="button-xl" @click="buyProcessorCore()">Yes</button>
            <button class="button-xl" @click="close()">No</button>
        </div>
    </window>`
})