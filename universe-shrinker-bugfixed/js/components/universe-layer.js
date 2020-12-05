Vue.component("universe-layer", {
    props: ["layer"],
    methods:
        {
            formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim)
        },
    template: `<div>
<p>You have shrunken <span class="big">{{formatNumber(layer.resource.amount, 2, 0, 1e9)}}</span> {{layer.name}}s</p>
<upgrade-container :upgrades="layer.upgrades"></upgrade-container>
</div>`
});