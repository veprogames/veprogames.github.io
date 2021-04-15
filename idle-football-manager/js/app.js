let lastUpdate = Date.now();
let windowFocus = true;

function initializeGame(){
    game.league.divisions[0].teams[0] = new Team("My Football Club", [], 0, 0, Date.now());
    game.team = game.league.divisions[0].teams[0];
    game.league.simulate();
    game.playerMarket.refresh();
}

function setup(){
    game.league = GeneratorUtils.generateLeague(0, game.country);
    window.initalGame = functions.getSaveString();
    if(localStorage.getItem("idleSoccerManager") === null){
        initializeGame();
    }
    else{
        functions.loadGame();
    }

    Vue.nextTick(() => game.init = true);

    requestAnimationFrame(update);
}

function update(){
    let dt = (Date.now() - lastUpdate) / 1000;
    lastUpdate = Date.now();

    if(game.settings.match.autoPlay && game.team.getAverageStamina() >= game.settings.match.minAutoPlayStamina){
        if(game.team.canPlayNextMatch() && (!game.currentMatch || game.currentMatch.ended)){
            game.league.divisions[game.team.divisionRank].playNextMatch();
        }
    }
    if(game.currentMatch){
        game.currentMatch.tick(dt);
    }
    for(let p of game.team.players){
        if(!p.active || !game.currentMatch || (game.currentMatch && game.currentMatch.ended)){
            p.regenerate(dt);
        }
    }

    for(let a of game.achievements){
        if(!a.completed){
            a.completed = a.requirement();
        }
    }

    requestAnimationFrame(update);
}

let app = Vue.createApp({
    data: function(){
        return game;
    },
    methods: functions,
    computed,
    setup
});

onblur = e => windowFocus = false;
onfocus = e => windowFocus = true;

setInterval(() => functions.saveGame(), 60e3);
onbeforeunload = () => functions.saveGame();