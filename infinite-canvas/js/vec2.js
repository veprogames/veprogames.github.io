class Vec2
{
    constructor(x, y)
    {
        this.x = new Decimal(x);
        this.y = new Decimal(y);
    }

    static get ZERO()
    {
        return new Vec2(0, 0);
    }

    static get ONE()
    {
        return new Vec2(1, 1);
    }

    add(x, y)
    {
        if(arguments.length === 2)
        {
            x = new Decimal(x);
        }
        y = y ? new Decimal(y) : NaN;
        if (arguments.length === 1)
        {
            return new Vec2(this.x.add(x.x), this.y.add(x.y));
        }
        else
        {
            return new Vec2(this.x.add(x), this.y.add(y));
        }
    }

    sub(x, y)
    {
        if(arguments.length === 2)
        {
            x = new Decimal(x);
        }
        y = y ? new Decimal(y) : NaN;
        if(arguments.length === 1)
        {
            return this.add(x.mul(-1));
        }
        return this.add(x.mul(-1), y.mul(-1));
    }

    mul(x, y)
    {
        x = new Decimal(x);
        y = y ? new Decimal(y) : NaN;
        if (arguments.length === 1)
        {
            return new Vec2(this.x.mul(x), this.y.mul(x));
        }
        return new Vec2(this.x.mul(x), this.y.mul(y));
    }

    div(x, y)
    {
        x = new Decimal(x);
        y = y ? new Decimal(y) : NaN;
        if(arguments.length === 1)
        {
            return this.mul(new Decimal(1).div(x), new Decimal(1).div(x));
        }
        return this.mul(new Decimal(1).div(x));
    }

    mag()
    {
        return Decimal.sqrt(this.x.pow(2).add(this.y.pow(2)));
    }

    toString()
    {
        return "(" + [this.x.toString(), this.y.toString()].join(",") + ")";
    }

    toFixed(x)
    {
        return "(" + [this.x.toFixed(x), this.y.toFixed(x)].join(",") + ")";
    }

    toExponential(n)
    {
        return "(" + [this.x.toExponential(n), this.y.toExponential(n)].join(",") + ")";
    }
}