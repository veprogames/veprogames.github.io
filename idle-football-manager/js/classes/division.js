class Division {
    constructor(rank, country, teams) {
        this.teams = teams;
        this.matchDay = 0;
        this.matchDays = (this.teams.length - 1) * 2;
        this.rank = rank;
        this.country = country;
    }

    getName(){
        return ["Newbie", "Rookie", "Starting", "Average", "Intermediate", "Veteran", "Pro", "Super", "Mega", "Master"][this.rank] + " League";
    }

    getRewards(){
        let base = Decimal.pow(6, GeneratorUtils.getNormRank(this.rank, this.country)).mul(game.moneyUpgrades.matchRewards.apply());
        return {
            win: base.mul(2000),
            draw: base.mul(800),
            lose: base.mul(500)
        };
    }

    getMatchDay(matchday) {
        let matches = [];
        let teams = []; //record teams that already have a match
        while(teams.length < this.teams.length) {
            let i = this.teams.findIndex(t => !teams.includes(t));
            let off = (matchday % (this.teams.length - 1)) + 1;
            let team1 = this.teams[i], team2 = this.teams[((i + off) % this.teams.length)];
            if(teams.includes(team2)){
                team2 = this.teams.find(t => !teams.includes(t) && t !== team1);
            }
            matches.push([team1, team2]);
            teams = teams.concat([team1, team2]);
        }
        return matches;
    }

    sort(){
        this.teams = this.getSortedTeams();
        return this.teams;
    }

    getSortedTeams(){
        return Array.from(this.teams).sort((team1, team2) => {
            if(team2.getPoints() - team1.getPoints() !== 0){
                return team2.getPoints() - team1.getPoints();
            }
            else if(team2.getGoalDifference() - team1.getGoalDifference() !== 0){
                return team2.getGoalDifference() - team1.getGoalDifference();
            }
            else if(team2.divisionStats.goalsShot - team1.divisionStats.goalsShot !== 0){
                return team2.divisionStats.goalsShot - team1.divisionStats.goalsShot;
            }
            return team1.divisionStats.goalsOpponent - team2.divisionStats.goalsOpponent;
        })
    }

    playNextMatch(){
        game.currentMatch = Match.from(game.nextMatch); //clone
        game.currentMatch.timeScale = game.settings.match.speed;
        game.stadium.fillStadium();
    }

    getPromotionRanks(){
        let nextDivision = game.league.divisions.find(d => d.rank > this.rank);
        return nextDivision ? 2 : 0;
    }

    getRelegationRanks(){
        let prevDivision = game.league.divisions.find(d => d.rank < this.rank);
        return prevDivision ? 2 : 0;
    }

    simulate() {
        for(let match of this.getMatchDay(this.matchDay)) {
            if(match[0] !== game.team && match[1] !== game.team) {
                let m = new Match(match[0], match[1], this.rank);
                m.simulate();
            }
            else {
                game.nextMatch = new Match(match[0], match[1], this.rank);
            }
        }
        this.matchDay++;
        if(this.matchDay % 4 === 0){
            game.playerMarket.refresh();
        }
    }

    hasEnded(){
        return this.matchDay >= this.matchDays;
    }

    load(obj){
        this.country = obj.country;
        this.matchDay = obj.matchDay;
    }
}