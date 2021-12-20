class Camera
{
    constructor(pos, range)
    {
        this.pos = pos;
        this.range = new Decimal(range);
        this.targetRange = this.range;
        this.smoothSpeed = 5;
        this.reset();
    }

    tick(delta)
    {
        this.range = this.range.mul(this.targetRange.div(this.range).pow(delta * this.smoothSpeed));
    }

    translate(x, y)
    {
        this.pos = this.pos.add(x, y);
    }

    worldToScreenPoint(x, y)
    {
        return (new Vec2(x, y).sub(this.pos)).div(this.range).mul(innerHeight).add(new Vec2(innerWidth / 2, innerHeight / 2));
    }

    screenToWorldPoint(x, y)
    {
        x -= innerWidth / 2;
        y -= innerHeight / 2;
        let normalized = new Vec2(x, y).div(innerHeight);
        return normalized.mul(this.range).add(this.pos);
    }

    reset()
    {
        this.targetRange = new Decimal(5);
        this.range = this.targetRange;
        this.pos = Vec2.ZERO;
        filterShapes();
    }
}