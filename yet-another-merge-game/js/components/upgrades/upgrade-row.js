Vue.component("upgrade-row", {
    props: ["upgrade"],
    template: `<tr>
    <td class="title">
        {{upgrade.name}} L{{upgrade.level | ftnum}}<span v-if="upgrade.maxLevel !== Infinity"> / {{upgrade.maxLevel | ftnum}}</span>
    </td>
    <td>
        {{upgrade.desc}}<br/>
        <b>{{upgrade.getEffectDisplay()}}</b>
    </td>
    <td>
        <button class="buy" :disabled="upgrade.buttonDisabled()" @click="upgrade.buy()">{{upgrade.getPriceDisplay()}}</button>
    </td>
</tr>`
});