class WindowManager {
    constructor() {
        this.windows = [];
    }

    createWindow(component) {
        const name = component.options.name;
        if (!this.windows.includes(name)) {
            VueUtils.createComponent(component);
            this.windows.push(name);
            app.$once("window-closed", () => {
                this.windows = this.windows.filter(window => window !== name);
            });
        }
    }
}