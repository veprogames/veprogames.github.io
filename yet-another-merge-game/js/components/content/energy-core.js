Vue.component("energy-core", {
    props: ["core", "selected"],
    methods: {
        activateEnergyCore: core => game.energyCores.activateEnergyCore(core)
    },
    computed: {
        coreName() {
            return `${this.core.name} +${this.core.level}`
        },
        neededMerges() {
            return this.core.getNeededMerges(this.core.level);
        },
        progress() {
            return this.core.merges / this.neededMerges;
        }
    },
    template: `<div :class="{selected: selected}" class="energy-core flex-vertical flex-between flex-center-v">
    <img class="background-core" src="images/tabs/energycores.png" alt=""/>
    <div v-if="!core.locked">
        <button v-if="!core.isActive" class="with-icon-l text-xxl text-outline flex-gap-h" @click="activateEnergyCore(core)"><img alt="Energy Core" :src="'images/'+core.img"/> {{coreName}}</button>
        <h3 v-else class="with-icon-l text-xxl text-outline flex-gap-h"><img alt="Energy Core" :src="'images/'+core.img"/> {{coreName}}</h3>

        <progress-bar class="progress-bar-l" :value="progress">{{core.merges | ftnum}} / {{neededMerges | ftnum}}</progress-bar>

        <div class="flex-center-center flex-gap-h boost">
            <p>x{{core.getBoost(core.level) | fnum(false, 2)}}</p>
            <i class="fas fa-arrow-right"></i>
            <p>x{{core.getBoost(core.level + 1) | fnum(false, 2)}}</p>
        </div>
    </div>
    <div v-else>
        <p class="locked margin-v-l"><i class="fas fa-lock"></i> LOCKED</p>
        <button class="button-xxl" @click="core.buy()">Buy for {{core.price | fnum}} <img alt="Quantum Foam" class="icon" src="images/currencies/quantumfoam.png"/></button>
    </div>
</div>`
});