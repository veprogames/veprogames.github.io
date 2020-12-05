Vue.component("universe", {
    props: ["universe"],
    computed:
    {
        planckLength: () => PLANCK_LENGTH
    },
    methods:
    {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim),
        formatLength: (n, prec) => functions.formatLength(n, prec)
    },
    template: `<div class="universe">
<p>You are currently shrinking a <b>{{universe.name}}</b></p>
<div v-if="universe.getShrinksPS() < 10">
    <p>Diameter: <b>{{formatLength(universe.size, 3)}}</b> / <b>{{formatLength(universe.maxSize, 3)}}</b></p>
    <p>Goal: <b>{{formatLength(planckLength, 2)}}</b></p>
</div>
<div v-else>
    <p>You are shrinking <span class="big">{{formatNumber(universe.getShrinksPS(), 2, 2, 1e9)}} </span><b>{{universe.name}}s</b> per second.</p>
</div>
<p>Resistance: <b>{{formatNumber(universe.resistance)}}</b></p>
</div>`
})