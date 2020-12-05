Vue.component("upgrade", {
    props: ["upgrade"],
    methods:
        {
            formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim)
        },
    template: `<button @click="upgrade.buy()" class="upgrade">
<h4>{{upgrade.name}} <span v-if="upgrade.maxLevel !== Infinity">{{upgrade.level}} / {{upgrade.maxLevel}}</span></h4>
<p v-html="upgrade.desc"></p>
<p>{{upgrade.getEffectDisplay()}}</p>
<p v-html="upgrade.getPriceDisplay()"></p>
</button>`
});