Vue.component("ui-toggle", {
    data() {
        return {
            active: this.value
        }
    },
    props: { value: Boolean },
    methods: {
        onInput() {
            this.active = !this.active;
            this.$emit("input", this.active);
        }
    },
    template: `<button @click="onInput()" :class="{active: value}" class="ui-toggle text-outline flex-between">
        <slot></slot>
        <span v-if="value">On</span>
        <span v-else>Off</span>
</button>`
});