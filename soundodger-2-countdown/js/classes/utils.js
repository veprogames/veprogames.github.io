class Utils {
    static formatTime(s) {
        let times = [Math.floor(s / 86400),
        Math.floor(s / 3600) % 24,
        Math.floor(s / 60) % 60,
        Math.floor(s) % 60];

        return times.map(t => t.toString().padStart(2, "0")).join(":");
    }
}