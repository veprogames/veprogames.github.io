app.component("player", {
    props: ["player"],
    data() {
        return {
            showStatBreakdown: false,
            teamPlayers: game.team.players
        }
    },
    methods: {
        formatNumber: functions.formatNumber
    },
    computed: {
        canMove(){
            if(this.player.hasRedCard() && (game.currentMatch && !game.currentMatch.ended || !this.player.active)){
                return false;
            }
            return (!this.teamFull && !this.player.active) || this.player.active;
        },
        teamFull(){
            return game.team.getActivePlayers().length >= 11;
        },
        isBought(){
            return this.teamPlayers.find(p => p === this.player) !== undefined;
        }
    },
    template: `<div class="player">
<p class="header"><div @click="showStatBreakdown = true" class="icon-flex"><img alt="" src="images/player.png"/><img v-if="player.hasRedCard()" alt="" src="images/icons/red-card.png"/> {{player.name}}</div>
<div class="icon-flex" v-if="isBought"><img alt="" src="images/icons/stamina.png"/> <progress :value="player.currentStamina" max="1"></progress></div></p>
<div class="stats">
    <p><span>ATT</span> {{formatNumber(player.getBaseAttack())}}</p>
    <p>{{formatNumber(player.getBaseDefense())}} <span>DEF</span></p>
    <p><span>AGG</span> {{formatNumber(player.aggressivity * 100)}}</p>
    <p>{{formatNumber(player.stamina * 100)}} <span>STA</span></p>
</div>
<div class="actions">
    <button :disabled="!canMove" v-if="isBought" @click="player.active = !player.active"><span v-if="!player.active">Move to Team</span><span v-else>Move from Team</span></button>
    <button v-if="!player.active && isBought" @click="player.sell()">Sell ({{formatNumber(player.getSellAmount())}} $)</button>
    <button v-if="!isBought" :disabled="!player.canAfford()" @click="player.buy()">Buy ($ {{formatNumber(player.getPrice())}})</button>
</div>
<transition name="window-grow">
    <window-player @closed="showStatBreakdown = false" v-if="showStatBreakdown" :player="player">
    
    </window-player>
</transition>
</div>`
});