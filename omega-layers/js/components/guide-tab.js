Vue.component("guide-tab", {
    computed: {
        betaUnlocked: () => game.layers.length >= 2,
        gammaUnlocked: () => game.layers.length >= 3,
        alephUnlocked: () => game.alephLayer.isUnlocked()
    },
    methods: {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim)
    },
    template: `<div class="guide-tab">
    <guide-item>
        <template v-slot:title>Getting Started</template>
        <template v-slot:text>In Omega Layers, your Goal is to produce Resources (e.g. &alpha;) and Prestige for higher Resources. You can buy
        things like Generators and Upgrades to accomplish that.<br/>
        To start, click the  "+1 &alpha;" button until you have 10 &alpha;. With 10 &alpha;, you can buy a Generator &alpha;<sub>1</sub>, which
        produces 1 &alpha; every second. Continue buying Generators to increase your &alpha; production.</template>
    </guide-item>
    <guide-item>
        <template v-slot:title>Generators</template>
        <template v-slot:text>Generators produce Resources every second or other Generators. The first Generator produces Resources. The 2nd Generator produces
        1st Generators, the 3rd Generator produces 2nd Generators and so on. You buy Generators with Resources</template>
    </guide-item>
    <guide-item>
        <template v-slot:title>Upgrades</template>
        <template v-slot:text>Upgrades improve several Aspects of the Game. For example, they help produce more Resource by making Generators stronger or increasing
        Prestige Rewards.</template>
    </guide-item>
    <guide-item>
        <template v-slot:title>Prestige</template>
        <template v-slot:text>Once you reach {{formatNumber(1e24, 2, 0)}} &alpha;, you can reset your current progress to get 1 &beta;, which
        can be spent on various things to make progress faster. You will gain your second &beta; at about {{formatNumber(1e31, 2, 0)}} &alpha;</template>
    </guide-item>
    <guide-item v-if="betaUnlocked">
        <template v-slot:title>Automators</template>
        <template v-slot:text>With Automators, you can automate the Game to your liking. For example, they can Prestige and Maximize Layers
        automatically. You can also set a desired interval, which you can use if you want to make them slower. For exmaple, with a desired
        interval of 3 seconds, the automator will never be faster than 3 seconds.</template>
    </guide-item>
    <guide-item v-if="betaUnlocked">
        <template v-slot:title>Simple Boost</template>
        <template v-slot:text>If you see a message below the amount of Resource you have, the Layer has a "Simple Boost". Simple Boost boosts the first Alpha Generator, resulting in much higher numbers. The Boost you get is based on the current Resource you
        have.</template>
    </guide-item>
    <guide-item v-if="betaUnlocked">
        <template v-slot:title>Power Generators</template>
        <template v-slot:text>Power Generators work like Generators, but they produce Power. Power boosts other Layers and help ramping those numbers up!</template>
    </guide-item>
    <guide-item v-if="gammaUnlocked">
        <template v-slot:title>Challenges</template>
        <template v-slot:text>Challenges are a way to increase your production. While active, they pose a penalty to your production, and you have
        to reach a certain goal. When the Goal is reached, you get a reward form completing the Challenge.</template>
    </guide-item>
    <guide-item v-if="gammaUnlocked">
        <template v-slot:title>Volatility</template>
        <template v-slot:text>Are you tired of clocking Prestige all the time? Now you can make layers non-volatile, resulting in them never resetting and instead
        giving a part of their Prestige Reward every second. Later on, Layers can also max themselves automatically.</template>
    </guide-item>
    <guide-item v-if="alephUnlocked">
        <template v-slot:title>Aleph</template>
        <template v-slot:text>After going &delta; at least once, you can gain Aleph, allowing you to buy Upgrades that globally boost the game.
        You gain 10x more Aleph for every new Layer you unlock after &delta;.
        </template>
    </guide-item>
</div>`
})