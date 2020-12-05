Vue.component("universe-layer-navigation",{
    props:["layers"],
    data: function()
    {
        return {
            layer: game.universeLayers["Universe"] || this.layers[game.settings.universeTab]
        };
    },
    methods:{
        changeTab: function(l)
        {
            this.layer = l;
            game.settings.universeTab = l.name;
        }
    },
    created: function()
    {
        this.changeTab(this.layers[game.settings.universeTab]);
    },
    template: `<div class="universe-layer-navigation">
<div class="tabs"><button v-for="l in layers" @click="changeTab(l)">{{l.name}}</button></div>
<universe-layer :layer="layer"></universe-layer>
</div>`
});