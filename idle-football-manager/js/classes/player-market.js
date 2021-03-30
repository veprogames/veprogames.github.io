class PlayerMarket {
    constructor() {
        this.players = [];
    }

    refresh() {
        this.players = [];
        let rank = game.team.divisionRank;
        let statBase = 16;
        let priceBase = 11;
        let pow = Math.log(priceBase) / Math.log(statBase);
        for (let i = 0; i < Math.floor(Math.random() * 10) + 15; i++) {
            let fact = Math.min(10, 0.1 / Math.random()) + 0.5 * Math.random();
            let minStat = Decimal.pow(statBase, GeneratorUtils.getNormRank(rank, game.country)).mul(10 + 30 * fact);
            let maxStat = minStat.mul(1 + 0.5 * Math.random());
            let price = Decimal.pow(priceBase, GeneratorUtils.getNormRank(rank, game.country)).mul(500 + 2000 * fact ** pow * (0.75 + 0.5 * Math.random()));
            let player = GeneratorUtils.generatePlayer(Math.floor(Math.random() * 1000000), minStat, maxStat, false, price);
            this.players.push(player);
        }
    }

    load(obj){
        this.players = [];
        for(let player of obj.players){
            let p = new Player(obj.name, obj.attack, obj.defense, obj.aggressivity, obj.stamina, obj.active, obj.marketValue);
            p.load(player);
            this.players.push(p);
        }
    }
}