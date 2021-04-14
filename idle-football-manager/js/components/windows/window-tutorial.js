app.component("window-tutorial", {
    emits: ["tutorialexit"],
    template: `<window class="window-tutorial">
    <template v-slot:header><slot name="header"></slot></template>
    <template v-slot:body>
        <div class="image">
            <slot name="image"></slot>
        </div>
        <slot name="body"></slot>
        <button @click="$emit('tutorialexit')">Exit Tutorial</button>
    </template>
</window>`
})