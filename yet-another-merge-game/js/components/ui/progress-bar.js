Vue.component("progress-bar", {
    props: {
        value: Number,
        percent: Boolean,
        max: {
            type: Number,
            default: 1
        }
    },
    computed: {
        fillWidth() {
            return (this.value / this.max * 100) + "%";
        }
    },
    template: `<div class="progress-bar">
        <div class="background"></div>
        <div :style="{width: fillWidth}" class="foreground"></div>
        <div class="content"><slot></slot><span v-if="percent"> {{(value * 100).toFixed(0)}} %</span></div>
    </div>`
});