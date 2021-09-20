Vue.component("processor-core", {
    props: ["core"],
    computed: {
        hasCores() {
            return game.quantumProcessor.cores.length >= 1;
        }
    },
    template: `<div class="processor-core flex-center-center">
    <b>x{{core.getCurrentBoost() | fnum}}</b>
    <button v-if="hasCores" @click="core.upgrade()">{{core.getCurrentPrice() | ftnum}}<img alt="Isotopes" class="icon" src="images/currencies/isotopes.png"/></button>
</div>`
});