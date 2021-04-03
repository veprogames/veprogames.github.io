app.component("stadium", {
    props: ["stadium"],
    methods: {
        formatNumber: functions.formatNumber
    },
    computed: {
        maxPayment(){
            return this.stadium.getTicketPrice().mul(this.stadium.getCapacity());
        }
    },
    template: `<div class="stadium">
<h2 class="big-heading">🏟 Your Stadium</h2>
<div class="info">
    <p>{{formatNumber(stadium.attendance)}} / {{formatNumber(stadium.getCapacity())}} watching</p>
    <p>{{formatNumber(stadium.fans)}} Fans (guaranteed viewers)</p>
    <p>{{formatNumber(stadium.getTicketPrice(), 2, 2)}} $ per Ticket → {{formatNumber(maxPayment)}} $ possible</p>
    <img alt="Stadium" src="images/stadium.png"/>
</div>
<h4>Upgrades</h4>
<div class="upgrade-container">
    <upgrade :upgrade="stadium.upgrades.capacity">
        <template v-slot:title>Stadium Capacity</template>
        <template v-slot:description>Increase the Amount of people that can watch the match at once.</template>
    </upgrade>
    <upgrade :upgrade="stadium.upgrades.ticketPrice">
        <template v-slot:title>Pricing Tactics</template>
        <template v-slot:description>Increase the Price for each Ticket. Don't worry, this won't decrease attendance.</template>
    </upgrade>
    <upgrade :upgrade="stadium.upgrades.fanGain">
        <template v-slot:title>The Famous Factor</template>
        <template v-slot:description>More people decide to become a fan.</template>
    </upgrade>
</div>
</div>`
});