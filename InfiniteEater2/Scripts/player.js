class Player extends PIXI.Sprite
{
    constructor(size)
    {
        super(PIXI.loader.resources["player"].texture);
        this.size = size;
        this.maxSize = size; //max size this run
        this.worldPosition = {x: new Decimal(0), y: new Decimal(0)};
        this.anchor.set(0.5, 0.5);
        this.eatMulti = new Decimal(1);
    }

    move(tx, ty)
    {
        this.worldPosition.x = this.worldPosition.x.add(tx);
        this.worldPosition.y = this.worldPosition.y.add(ty);
    }

    collidesWith(edible)
    {
        return Utils.pythagoras(this.worldPosition.x, this.worldPosition.y,
                            edible.worldPosition.x, edible.worldPosition.y).lte(this.size.add(edible.size).div(2));
    }

    getNearestConsumableEdible(edibles)
    {
        let lowestDist = Decimal.pow(10, Number.MAX_SAFE_INTEGER);
        let edible = null;
        edibles.forEach(e => 
            {
                let dist = Utils.pythagoras(this.worldPosition.x, this.worldPosition.y, 
                        e.worldPosition.x, e.worldPosition.y);
                if(dist.lte(lowestDist) && e.size.lte(this.size))
                {
                    lowestDist = dist;
                    edible = e;
                }
            });
        return edible;
    }
}