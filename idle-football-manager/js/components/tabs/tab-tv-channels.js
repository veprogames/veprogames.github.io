app.component("tab-tv-channels", {
    data(){
        return {
            channels: game.tv.channels,
            upgrades: game.tv.upgrades
        }
    },
    template: `<div class="tab-tv-channels">
    <h4 class="big-heading">Channels</h4>
    <div class="channels">
        <tv-channel v-for="(c, i) in channels" :channel="c"></tv-channel>
    </div>
    <h4 class="big-heading">Upgrades</h4>
    <div class="upgrade-container">
        <upgrade :upgrade="upgrades.matchReward">
            <template v-slot:title>Statistical Recognition</template>
            <template v-slot:description>Increase the Match Rewards by a percentage of Stadium Rewards.</template>
        </upgrade>
        <upgrade :upgrade="upgrades.channelMoney">
            <template v-slot:title>Cool Ads and nice Commentary</template>
            <template v-slot:description>Channels pay you more Money each second.</template>
        </upgrade>
        <upgrade :upgrade="upgrades.matchSpeed">
            <template v-slot:title>Beyond Speed</template>
            <template v-slot:description>Increase max Match Speed.<br/>
            <i>Wanna see me play a match? Wanna see me do it again?</i></template>
        </upgrade>
    </div>
</div>`
});