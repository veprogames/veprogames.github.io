app.component("window-player" , {
    props: ["player"],
    methods: {
        formatNumber: functions.formatNumber,
        formatTime: functions.formatTime
    },
    computed: {
        regenerationTimeLeft(){
            return this.player.getRegenerationTime() * (1 - this.player.currentStamina);
        }
    },
    template: `<window class="window-player">
    <template v-slot:header>
        <div class="icon-flex">
            <img src="images/player.png"/>
            <h4>{{player.name}}</h4>
        </div>
    </template>
    <template v-slot:body>
        <div class="stats">
            <div><p><b>Attack:</b> {{formatNumber(player.getBaseAttack())}}</p>
                  → Modified by Stamina<br/>
                  → Currently {{formatNumber(player.getAttack())}}</div>
            <div><p><b>Defense:</b> {{formatNumber(player.getBaseDefense())}}</p>
                  → Modified by Stamina<br/>
                  → Currently {{formatNumber(player.getDefense())}}</div>
            <div><p><b>Aggressiveness:</b> {{formatNumber(player.aggressivity * 100)}}</p>
                  → x{{formatNumber(player.aggressivity, 2, 2)}} Chance to get a Red Card</div>
            <div><p><b>Stamina:</b> {{formatNumber(player.stamina * 100)}}</p>
                  → x{{formatNumber(player.stamina, 2, 2)}} Stamina Regeneration<br/>
                  → Lose &div;{{formatNumber(player.stamina, 2, 2)}} Stamina per Game<br/>
                  → {{formatTime(player.getRegenerationTime())}} to regenerate<span v-if="regenerationTimeLeft > 0"> ({{formatTime(regenerationTimeLeft)}} left)</span></div>
        </div>
    </template>
</window>`
});