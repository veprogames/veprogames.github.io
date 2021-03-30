app.component("tab-player-market", {
    methods: {
        formatNumber: functions.formatNumber
    },
    computed: {
        playerMarket(){
            return this.$root.playerMarket
        },
        money(){
            return game.money;
        }
    },
    template: `<div class="tab-player-market">
<p class="money">You have {{formatNumber(money)}} $</p>
<player-market :playerMarket="playerMarket"></player-market>
</div>`
});