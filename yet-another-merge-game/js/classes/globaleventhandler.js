class GlobalEventHandler extends EventTarget {
    constructor(){
        super();
    }

    dispatchPreInit(){
        this.dispatchEvent(new Event("gamepreinit"));
    }

    dispatchInit(){
        this.dispatchEvent(new Event("gameinit"));
    }

    dispatchGameLoad(){
        this.dispatchEvent(new Event("gameload"));
    }

    dispatchUpdate(){
        this.dispatchEvent(new Event("gameupdate"));
    }

    dispatchSubscribe(){
        this.dispatchEvent(new Event("subscribeyt"));
    }
}