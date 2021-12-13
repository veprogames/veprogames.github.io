Vue.component("upgrade", {
    props: {
        upgrade: Upgrade,
        resourceicon: String
    },
    computed: {
        canAfford() {
            return !this.upgrade.buttonDisabled();
        },
        isMaxed() {
            return this.upgrade.level >= this.upgrade.maxLevel;
        },
        levelColor() {
            return `hsl(${this.upgrade.level * 25}deg, 100%, 75%)`;
        },
        hasMaxLevel() {
            return this.upgrade.maxLevel !== Infinity;
        }
    },
    template: `<div class="upgrade flex-vertical margin">
        <div>
            <h5>{{upgrade.name}} <span :style="{color: levelColor}">{{upgrade.level | ftnum}}</span>
                <span v-if="hasMaxLevel"> / <span :style="{color: levelColor}">{{upgrade.maxLevel | ftnum}}</span></span>
            </h5>
        </div>
        <div class="flex-between">
            <div class="info flex-center flex-vertical">
                <p class="margin-v">{{upgrade.desc}}</p>
                <button :disabled="!canAfford" class="buy with-icon" @click="upgrade.buy()">
                    <img v-if="resourceicon && !isMaxed" :src="resourceicon"/>
                    {{upgrade.getPriceDisplay()}}</button>
                <p class="effect flex-center-center padding-v">{{upgrade.getEffectDisplay()}}</p>
            </div>
            <div class="buy flex-vertical flex-center-center margin">
                <button :disabled="!canAfford" class="buy with-icon" @click="upgrade.buy()">
                    <img v-if="resourceicon && !isMaxed" :src="resourceicon"/>
                    {{upgrade.getPriceDisplay()}}</button>
                <p class="effect padding-v">{{upgrade.getEffectDisplay()}}</p>
            </div>
        </div>
    </div>`
});

Vue.component("upgrade-matter", {
    props: {
        upgrade: Upgrade
    },
    template: `<upgrade :upgrade="upgrade" resourceicon="images/currencies/matter.png"></upgrade>`
});

Vue.component("upgrade-quantum-foam", {
    props: {
        upgrade: Upgrade
    },
    template: `<upgrade :upgrade="upgrade" resourceicon="images/currencies/quantumfoam.png"></upgrade>`
});

Vue.component("upgrade-isotope", {
    props: {
        upgrade: Upgrade
    },
    template: `<upgrade :upgrade="upgrade" resourceicon="images/currencies/isotopes.png"></upgrade>`
});

Vue.component("upgrade-molecule", {
    props: {
        upgrade: Upgrade
    },
    template: `<upgrade :upgrade="upgrade" resourceicon="images/currencies/molecules.png"></upgrade>`
});