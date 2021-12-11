Vue.component("resource-view", {
    props: { icon: String },
    template: `<div class="resource with-icon">
        <img :src="icon" alt="Quantum Foam: " />
        <slot></slot>
    </div>`
});