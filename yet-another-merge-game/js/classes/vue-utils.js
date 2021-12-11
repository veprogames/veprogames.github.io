class VueUtils {
    static createComponent(comp, container = document.body, propsData = {}) {
        const instance = new comp({ propsData });
        instance.$mount();
        container.appendChild(instance.$el);
        return instance;
    }

    static destroyComponent(instance) {
        instance.$el.parentElement.removeChild(instance.$el);
        instance.$destroy();
    }
}