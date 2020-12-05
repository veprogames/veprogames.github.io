Vue.component("automator-container", {
    props: ["automators"],
    computed:
        {
            thetaEnergy: () => game.thetaEnergy
        },
    methods:
        {
            formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim)
        },
    template: `<div>
<p>You have <span class="big">{{formatNumber(thetaEnergy, 2, 2, 1e9)}}</span> Theta Energy (&theta;<sub>E</sub>)</p>
<div class="automator-container">
    <automator v-for="(a, i) in automators" :automator="a" :key="i"></automator>
</div>
</div>`
})