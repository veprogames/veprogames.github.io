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
    <div>
        <h4>{{team.name}}</h4>
        <p>ATT {{formatNumber(totalAttack)}}</p>
        <p>DEF {{formatNumber(totalDefense)}}</p>
        <p>Synergy {{formatNumber(team.getSynergy() * 100)}} %</p>
    </div>
    <div>
        <label>Strategy<select v-model.number="team.strategy">
            <option :value="strategyNormal">ATT x1, DEF x1</option>
            <option :value="strategyOffensive">ATT x1.3, DEF &div;1.3</option>
            <option :value="strategyDefensive">DEF x1.3, ATT &div;1.3</option>
        </select></label>
        <label>Aggressiveness<select v-model.number="team.aggressivity">
            <option :value="strategyNormal">ATT x1, DEF x1, Red Cards x1</option>
            <option :value="strategyOffensive">ATT x1.1, DEF x1.1, Red Cards x2</option>
            <option :value="strategyDefensive">ATT &div;1.1, DEF &div;1.1, Red Cards &div;2</option>
        </select></label>
    </div>
</div>
<div>
    <div class="players active">
        <player v-for="(p, i) in team.getActiveSortedPlayers()" :player="p" :key="i"></player>
    </div>
</div>
<div class="inactive-players">
    <div class="no-players" v-if="playerCount === 0">
        You don't have any players in your Team. Consider buying some first in the Market.
    </div>
    <div class="players inactive">
        <player v-for="(p, i) in team.getInactiveSortedPlayers()" :player="p" :key="i"></player>
    </div>
</div>
</div>`
});