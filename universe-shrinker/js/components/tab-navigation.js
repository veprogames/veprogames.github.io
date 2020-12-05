Vue.component("tab-navigation",{
    methods:{
        selectTab(t)
        {
            game.settings.tab = t;
        },
        maxAll: () => functions.maxAll(),
        universeLayersUnlocked: () => functions.universeLayersUnlocked(),
        thetaUnlocked: () => (game.resources.Omniverse && game.resources.Omniverse.maxAmount.gte(1)) || game.totalThetaEnergy.gte(1),
        autoUnlocked: () => game.totalThetaEnergy.gte(1)
    },
    template: `<div class="tab-navigation">
    <button @click="selectTab('shrinkers')">Shrinkers</button>
    <button @click="selectTab('rhoupgrades')">Rho Upgrades</button>
    <button @click="selectTab('universelayers')" v-if="universeLayersUnlocked() > 0">Universe Layers</button>
    <button @click="selectTab('theta')" v-if="thetaUnlocked()">Heat Death (&theta;<sub>E</sub>)</button>
    <button @click="selectTab('auto')" v-if="autoUnlocked()">Automation</button>
    <button @click="selectTab('options')">Options</button>
    <button @click="maxAll()">Max All (M)</button>
</div>`
})