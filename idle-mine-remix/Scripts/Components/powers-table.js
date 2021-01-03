Vue.component("powers-table", {
    methods:
        {
            formatNumber: (n, prec, lim, prec1000) => functions.formatNumber(n, prec, lim, prec1000),
            getPrestigeEffect: function(i)
            {
                let val = this.pow.values[i];
                let result = Decimal.max((val.div(1e3)).pow(0.5 - i * 0.1), 1);
                if(i === 3)
                {
                    result = new Decimal(Decimal.log10(result) + 1); //gem bonus shouldnt be exponential
                }
                return result;
            },
            prestigePower: function(i)
            {
                if(this.pow.values[i + 1].lt(this.getPrestigeEffect(i)))
                {
                    this.pow.values[i + 1] = this.getPrestigeEffect(i);
                    this.pow.values[i] = this.pow.values[i].pow(applyUpgrade(game.powers.upgrades.powerResetKeep)); //keep x^y to encourage prestiging
                }
            }
        },
    props: ["pow"],
    template: `<table class="powers-table">
    <tr v-for="(p, i) in pow.values" :key="i">
        <td>{{pow.names[i]}}</td>
        <td><img class="inline" :src="'Images/' + pow.icons[i]"/> x {{formatNumber(pow.values[i], 2, 1e9, 3)}}</td>
        <td>
            <span v-if="i < 4">
                <button @click="prestigePower(i)" :disabled="pow.values[i + 1].gte(getPrestigeEffect(i))" v-if="pow.values[i].gte(1e3) || (i < pow.values.length - 1) && pow.values[i + 1].gt(1)">Prestige: x{{formatNumber(getPrestigeEffect(i), 2, 1e9, 2)}}</button> 
                <span v-else>Req. x{{formatNumber(1e3)}}</span>
            </span>
        </td>
    </tr>
</table>`
});