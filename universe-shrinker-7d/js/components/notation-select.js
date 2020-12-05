Vue.component("notation-select", {
    data: function()
    {
        return {
            notations: numberFormatters
        }
    },
    methods: {
        setNumberFormatter: function(f)
        {
            game.settings.numberFormatter = f;
            game.settings.formatterIndex = numberFormatters.findIndex(n => n === f);
        }
    },
    template: `<div class="notation-select">
<span>Notation</span>
<div class="selection">
    <button v-for="(n, i) in notations" @click="setNumberFormatter(n)" :key="i">{{n.name}}</button>
</div>
</div>`
})