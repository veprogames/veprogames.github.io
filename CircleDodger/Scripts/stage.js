class Stage
{
    constructor(seconds, config)
    {
        this.seconds = seconds;
        this.objectColor = config.objectColor ? config.objectColor : "#ffffff";
        this.speed = config.speed ? config.speed : 0.4;
        this.width = config.width ? config.width : [1, 2];
        this.bgColor = config.bgColor ? config.bgColor : "#000000";
        this.circleColor = config.circleColor ? config.circleColor : "#ffffff";
        this.bpm = config.bpm ? config.bpm : 120;
        this.zoomAmount = config.zoomAmount ? config.zoomAmount : 0.1;
        this.blur = config.blur !== undefined ? config.blur : 3;
        this.spawnTolerance = config.spawnTolerance ? config.spawnTolerance : 0.9;

        this.getNextObjectOffset = config.getNextObject ? config.getNextObject : this.getNextObjectOffset;
        this.getSpeedModifier = config.getSpeedModifier ? config.getSpeedModifier : this.getSpeedModifier;
    }

    getNextObjectOffset()
    {
        let offset = -0.5 + Math.random();
        if(time.elapsed % 10 > 7)
        {
            offset = 0.7;
        }
        else
        {
            if(Math.random() < 0.2)
            {
                offset *= 2.5;
            }
        }

        return offset;
    }

    getSpeedModifier()
    {
        return 1;
    }
}