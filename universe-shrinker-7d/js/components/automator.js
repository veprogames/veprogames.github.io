Vue.component("automator", {
    props: ["automator"],
    computed:{
        canAfford: function()
        {
            return game.thetaEnergy.gte(this.automator.getPrice(this.automator.level));
        },
        getActiveText: function()
        {
            return this.automator.active ? "On" : "Off";
        }
    },
    template: `<div class="automator">
<button :disabled="!canAfford" @click="automator.buy()">
<h4>{{automator.name}}</h4>
<p>{{automator.desc}}</p>
<p>{{automator.getEffectDisplay()}}</p>
<p v-html="automator.getPriceDisplay()"></p>
</button>
<button class="toggle" :disabled="automator.level === 0" @click="automator.active = !automator.active">{{getActiveText}}</button>
</div>`
})