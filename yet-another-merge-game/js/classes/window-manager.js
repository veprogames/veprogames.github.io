class WindowManager {
    constructor() {
        this.window = null;
    }

    createWindow(component) {
        if (this.window === null) {
            const window = VueUtils.createComponent(component);
            this.window = window;
            app.$once("window-closed", () => {
                this.window = null;
            });
        }
    }
}