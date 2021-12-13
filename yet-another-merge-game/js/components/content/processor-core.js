Vue.component("processor-core", {
    props: ["core"],
    computed: {
        hasCores() {
            return game.quantumProcessor.cores.length >= 1;
        },
        canAfford() {
            return game.isotopes.amount.gte(this.core.getCurrentPrice());
        }
    },
    template: `<div class="processor-core flex-center-center">
    <img class="processor" alt="processor" src="images/tabs/quantumprocessor.png" />
    <div class="info">
        <span class="with-icon boost"><img alt="Matter x" src="images/currencies/matter.png"/> x {{core.getCurrentBoost() | fnum}}</span>
        <button class="button with-icon" v-if="hasCores" :disabled="!canAfford" @click="core.upgrade()"><img alt="ISO" src="images/currencies/isotopes.png"/> {{core.getCurrentPrice() | ftnum}}</button>
    </div>
</div>`
});