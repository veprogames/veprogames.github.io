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
        },
        refreshTime(){
            return 4 - game.league.divisions[game.team.divisionRank].matchDay % 4;
        }
    },
    template: `<div class="tab-player-market">
<p class="money">You have {{formatNumber(money)}} $<br/>
    Refresh in {{refreshTime}} Matchday(s)</p>
<player-market :playerMarket="playerMarket"></player-market>
</div>`
});