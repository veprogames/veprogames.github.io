class Update{
    constructor(name, releaseTime){
        this.name = name;
        this.releaseTime = typeof releaseTime == "string" ? Date.parse(releaseTime) : releaseTime;
    }

    daysFrom(update){
        return (this.releaseTime - update.releaseTime) / (86400 * 1000);
    }
}

class UpdateList{
    constructor(updates){
        this.updates = updates;
    }

    getDifferenceList(){
        const times = [];
        let lastUpdate = null;
        for(const update of this.updates){
            times.push(lastUpdate === null ? ((update.releaseTime - UpdateList.BASE_DATE) / (86400 * 1000) ) : update.daysFrom(lastUpdate));
            lastUpdate = update;
        }
        return times;
    }

    static get BASE_DATE(){
        return Date.parse("2013-08-13");
    }

    static get TOTAL_DAYS_SINCE_GD10(){
        return (Date.now() - UpdateBar.BASE_DATE) / (86400 * 1000);
    }

    static from(updateList){
        const updates = [];
        for (const { name, str } of updateList) {
            updates.push(new Update(name, str));
        }
        return new UpdateList(updates);
    }
}