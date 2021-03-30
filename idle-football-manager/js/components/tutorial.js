app.component("tutorial", {
    data(){
        return {
            stage: 0,
            logo: game.team.logo
        }
    },
    methods:{
        exitTutorial(){
            this.stage = -1;
            game.restartedTutorial = false;
        }
    },
    template: `<div class="tutorial">
<window-tutorial v-if="stage === 0" @closed="stage++" @tutorialexit="exitTutorial()">
    <template v-slot:header>
        <div class="icon-flex"><img src="images/icons/help.png"/> Tutorial</div>
    </template>
    <template v-slot:body>
        <p>Welcome to Idle Football Manager, 
        a Game where you build your own Football Team and compete to become the champion!</p>
        <p>You can freely navigate inside the Game while the Tutorial Window is open. Feel free to try out the mechanics
        on the go! Click the (X) on the top right of the window to view the next page</p>
        <p>You can always restart the Tutorial in the Settings Menu!</p>
    </template>
</window-tutorial>
<window-tutorial v-if="stage === 1" @closed="stage++" @tutorialexit="exitTutorial()">
    <template v-slot:header><div class="icon-flex"><img src="images/icons/help.png"/> Your Team</div></template>
    <template v-slot:body><p>You can add up to 11 Players to your Team. The overall strength of your Team is determined by the sum of your
    Players stats. Your Teams strength is multiplied by <b>Synergy</b>.</p>
    <p>The more Players that are active in your team, the higher your synergy is.
    Therefore, it is better to have more weak players than one strong player.</p>
    <p>Each Player has 4 Stats: <b>ATT</b>ack, <b>DEF</b>ense, <b>AGG</b>ressivity (Chance to get a Red Card) and 
    <b>STA</b>mina (How fast players lose and regenerate Stamina). Stamina passively fills every second while a player is not playing.</p></template>
    <template v-slot:image>
        <team-logo :logo="logo"></team-logo>
    </template>
</window-tutorial>
<window-tutorial v-if="stage === 2" @closed="stage++" @tutorialexit="exitTutorial()">
    <template v-slot:header><div class="icon-flex"><img src="images/icons/help.png"/> Player Market</div></template>
    <template v-slot:body><p>This is the Place where you can buy new Players for your Team. The more expensive a player is, the more money you have
    to pay.</p>
    <p>The Market refreshes every few matchdays and on new Seasons. You can re-buy sold Players while they are still there.</p></template>
    <template v-slot:image>
        <img alt="" src="images/icons/player-market.png"/>
    </template>
</window-tutorial>
<window-tutorial v-if="stage === 3" @closed="stage++" @tutorialexit="exitTutorial()">
    <template v-slot:header><div class="icon-flex"><img src="images/icons/help.png"/> Upgrades</div></template>
    <template v-slot:body><p>Upgrades are bought with Money and let you boost different aspects of the Game. You need to have at least one Player in your Team
    to be able to buy Upgrades.</p></template>
    <template v-slot:image>
        <img alt="" src="images/icons/upgrades.png"/>
    </template>
</window-tutorial>
<window-tutorial v-if="stage === 4" @closed="stage++" @tutorialexit="exitTutorial()">
    <template v-slot:header><div class="icon-flex"><img src="images/icons/help.png"/> League</div></template>
    <template v-slot:body><p>This is the main part of the Game. Each League has ten divisions, of which each has 18 Matchdays.
    At the end of the Season, you can either promote to a higher division (green cells) or relegate to a lower division (red cells).</p></template>
    <template v-slot:image>
        <img alt="" src="images/icons/league.png"/>
    </template>
</window-tutorial>
<window-tutorial v-if="stage === 5" @closed="stage++" @tutorialexit="exitTutorial()">
    <template v-slot:header><div class="icon-flex"><img src="images/icons/help.png"/> Match</div></template>
    <template v-slot:body><p>In the Match tab, you can watch the Game live. Adjust the Speed of the Game to your liking. At the end of a Match,
    you get money based on if you won, drew or lost the game. The reward changes based on the division you are in.</p></template>
    <template v-slot:image>
        <img alt="" src="images/icons/football.png"/>
    </template>
</window-tutorial>
</div>`
});