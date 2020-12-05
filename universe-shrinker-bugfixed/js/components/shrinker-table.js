Vue.component("shrinker-table", {
    props: ["shrinkers"],
    methods: {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim)
    },
    computed: {
        totalProd: () => functions.getRhoProduction(),
        totalShrink: () => functions.getTotalShrinkPower()
    },
    template: `<table class="shrinker-table">
<thead>
    <th>Name</th>
    <th>Level</th>
    <th>Production</th>
    <th>Shrink Power</th>
    <th>Upgrade</th>
</thead>
<shrinker v-for="(s, i) in shrinkers" :shrinker="s" :key="i"></shrinker>
<tfoot>
    <td><b>&Sigma;</b></td>
    <td></td>
    <td>{{formatNumber(totalProd, 2, 2, 1e6)}} &rho;<sub>p</sub>/s</td>
    <td>&div;{{formatNumber(totalShrink, 3, 5, 1e6)}}/s</td>
    <td></td>
</tfoot>
</table>`
})