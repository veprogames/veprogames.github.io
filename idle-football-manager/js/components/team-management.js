app.component("team-management", {
    props: ["team"],
    computed: {
        totalAttack(){
            return this.team.getCombinedAttack();
        },
        totalDefense(){
            return this.team.getCombinedDefense();
        },
        activePlayers(){
            return this.team.getActivePlayers();
        },
        inactivePlayers(){
            return this.team.getInactivePlayers();
        },
        playerCount(){
            return this.team.players.length;
        },
        strategyNormal(){
            return Strategy.NORMAL
        },
        strategyOffensive(){
            return Strategy.OFFENSIVE
        },
        strategyDefensive(){
            return Strategy.DEFENSIVE
        }
    },
    methods: {
        setStrategy(strategy){
            this.team.strategy = strategy;
        },
        setAggressivity(strategy){
            this.team.aggressivity = strategy;
        },
        strategySelected(strategy){
            return this.team.strategy === strategy;
        },
        aggressivitySelected(strategy){
            return this.team.aggressivity === strategy;
        },
        formatNumber: functions.formatNumber
    },
    template: `<div class="team-management">
<div class="header">
    <h4>{{team.name}}</h4>
    <p>ATT {{formatNumber(totalAttack)}}</p>
    <p>DEF {{formatNumber(totalDefense)}}</p>
    <p>Synergy {{formatNumber(team.getSynergy() * 100)}} %</p>
</div>
<div class="strategies">
    <div class="strategy">
        <h4>Strategy</h4>
        <button :class="{'selected': strategySelected(strategyNormal)}" @click="setStrategy(strategyNormal)">Normal</button>
        <button :class="{'selected': strategySelected(strategyOffensive)}" @click="setStrategy(strategyOffensive)">Offensive<br/>ATT x1.3, DEF &div;1.3</button>
        <button :class="{'selected': strategySelected(strategyDefensive)}" @click="setStrategy(strategyDefensive)">Defensive<br/>DEF x1.3, ATT &div;1.3</button>
    </div>
    <div class="strategy">
        <h4>Aggressiveness</h4>
        <button :class="{'selected': aggressivitySelected(strategyNormal)}" @click="setAggressivity(strategyNormal)">Normal</button>
        <button :class="{'selected': aggressivitySelected(strategyOffensive)}" @click="setAggressivity(strategyOffensive)">Aggressive<br/>ATT x1.1, DEF x1.1, 100% more Red Cards</button>
        <button :class="{'selected': aggressivitySelected(strategyDefensive)}" @click="setAggressivity(strategyDefensive)">Defensive<br/>ATT &div;1.1, DEF &div;1.1, 50% less Red Cards</button>
    </div>
</div>
<div>
    <div class="players active">
        <player v-for="(p, i) in team.getActiveSortedPlayers()" :player="p" :key="i"></player>
        <div v-for="i in 11 - activePlayers.length" class="placeholder"></div>
    </div>
</div>
<div class="inactive-players">
    <div v-if="playerCount === 0">
        You don't have any players in your Team. Consider buying some first in the Market.
    </div>
    <div class="players inactive">
        <player v-for="(p, i) in team.getInactiveSortedPlayers()" :player="p" :key="i"></player>
    </div>
</div>
</div>`
});