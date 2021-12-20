class Utils
{
    static textureFromResource(name)
    {
        return PIXI.loader.resources[name].texture;
    }

    static textureFromSheet(name, x, y, w, h)
    {
        let texture = Utils.textureFromResource(name).clone();
        texture.frame = new PIXI.Rectangle(x, y, w, h);
        return texture;
    }

    static pythagoras(x1, y1, x2, y2)
    {
        x1 = new Decimal(x1);
        x2 = new Decimal(x2);
        y1 = new Decimal(y1);
        y2 = new Decimal(y2);
        let dx = x2.sub(x1);
        let dy = y2.sub(y1);
        return Decimal.sqrt(Decimal.pow(dx, 2).add(Decimal.pow(dy, 2)));
    }

    static lerp(x, y, t)
    {
        x = new Decimal(x);
        y = new Decimal(y);
        return x.add((y.sub(x)).mul(t));
    }

    static clamp(x, min, max)
    {
        return Math.min(max, Math.max(min, x));
    }

    static VectorFromRotation(r)
    {
        r -= Math.PI * 0.5;
        return {
            x: Math.cos(r),
            y: Math.sin(r)
        }
    }

    static rotationFromVector(x, y)
    {
        //let baseAngle = Math.atan2(y, x);
        //let angle = (baseAngle - Math.PI * 0.5) * -1;
        let angle = Math.atan2(y, x);
        if(angle > -Math.PI && angle < Math.PI)
        {
            angle = angle * -1 + Math.PI * 0.5;
        }
        return angle - Math.PI;
    }

    static colorToInt(r, g, b)
    {
        return r * 0x10000 + g * 0x100 + b;
    }

    static normalize(x, y)
    {
        x = new Decimal(x);
        y = new Decimal(y);
        let highest = Decimal.max(Decimal.abs(x), Decimal.abs(y));
        if(highest.equals(0))
        {
            return{
                x: new Decimal(0),
                y: new Decimal(0)
            }
        }
        return {
            x: x.div(highest),
            y: y.div(highest)
        };
    }
}