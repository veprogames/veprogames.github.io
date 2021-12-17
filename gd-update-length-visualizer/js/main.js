const W = innerWidth, H = innerHeight;

const updates = UpdateList.from([
    { name: "1.1", str: "2013-09-10" },
    { name: "1.2", str: "2013-10-14" },
    { name: "1.3", str: "2013-11-20" },
    { name: "1.4", str: "2013-12-26" },
    { name: "1.5", str: "2014-01-30" },
    { name: "1.6", str: "2014-03-25" },
    { name: "1.7", str: "2014-05-21" },
    { name: "1.8", str: "2014-08-14" },
    { name: "1.9", str: "2014-11-09" },
    { name: "2.0", str: "2015-08-26" },
    { name: "2.1", str: "2017-01-16" },
    { name: "2.11", str: "2017-11-15" },
    { name: "2.2", str: Date.now() }
]);

let container;

document.fonts.ready.then(fonts => {
    const app = new Vue({
        el: "#app",
        data: {
            konva: {
                width: innerWidth,
                height: innerHeight
            },
            updateBars: UpdateBar.createFromReleaseDates(updates),
            lengthComparision: new UpdateLengthComparision(updates),
            updateGraph: new UpdateTimeGraph(updates)
        }
    });
    
    container = app.$refs.stage.$el;

    const msgs = [
        "El Pollo Esta Lista?!?!",
        "\"I have to get it out this year it is getting ridiculus\"",
        "Low Dearth",
        "2.2 soon™"
    ];

    document.title += " " + msgs[Math.floor(msgs.length * Math.random())];
});