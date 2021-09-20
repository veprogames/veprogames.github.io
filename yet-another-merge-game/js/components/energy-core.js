Vue.component("energy-core", {
    props: ["core"],
    methods: {
        activateEnergyCore: core => game.energyCores.activateEnergyCore(core)
    },
    template: `<div>
    <div v-if="!core.locked" class="energy-core flex-vertical flex-between flex-center-v">
        <p class="title">{{core.name}} +{{core.level}}</p>
        <img alt="Energy Core" :src="'images/'+core.img"/>
        <p>{{core.merges}} / {{core.getNeededMerges(core.level)}}</p>
        <p class="text-xl">x{{core.getBoost(core.level) | fnum(false, 2)}} → x{{core.getBoost(core.level + 1) | fnum(false, 2)}}</p>
        <button v-if="!core.isActive" @click="activateEnergyCore(core)">Select</button>
    </div>
    <div v-else class="energy-core flex-vertical flex-between flex-center-v">
        <p>LOCKED</p>
        <button @click="core.buy()">Buy for {{core.price | fnum}} <img alt="Quantum Foam" class="icon" src="images/currencies/quantumfoam.png"/></button>
    </div>
</div>`
});