class EdibleObject extends PIXI.Sprite
{
    constructor(size, posX, posY, type)
    {
        super(PIXI.loader.resources["edible"].texture);
        this.x = -10000; //prevent appearing on top left for 1 frame
        this.size = size;
        this.worldPosition = {x: posX, y: posY};
        this.anchor.set(0.5, 0.5);
        this.lifeTime = 0;
        this.behavior = function(edible){};
        this.name = "";
        this.nutrition = new Decimal(1);
        this.damage = 0;
        this.color = 0; //used for tinting

        /*this.filter = new PIXI.AbstractFilter(document.querySelector("#shader_edible_v").innerHTML, document.querySelector("#shader_edible_f").innerHTML,
        {
            time: 
            {
                type: "f",
                value: 0
            },
            isBigger: 
            {
                type: "i",
                value: 1
            }
        });

        this.filters = [this.filter];*/

        this.applyType(type);
    }

    applyType(type)
    {
        this.name = type.name;
        this.nutrition = type.nutrition;
        this.texture = type.texture;
        this.damage = type.damage;
        this.stationary = type.stationary;
        
        if(type.randomColor)
        {
            this.color = Math.random() * 0xffffff;
        }
        else
        {
            this.color = 0xffffff;
        }
    }

    applyRange(obj)
    {
        //let rTint = true;
        obj.forEach(o => 
            {
                if(this.size.gte(o.min) && this.size.lte(o.max))
                {
                    this.applyType(o.type)
                }
            });
        //if(rTint) this.tint = Math.random() * 0xffffff;
    }

    move(tx, ty)
    {
        this.worldPosition.x = this.worldPosition.x.add(tx);
        this.worldPosition.y = this.worldPosition.y.add(ty);
    }

    tick(delta)
    {
        let oldX = this.worldPosition.x;
        let oldY = this.worldPosition.y;

        this.lifeTime += delta;
        this.behavior(this, delta);

        let moveDelta = 
        {
            x: this.worldPosition.x.sub(oldX),
            y: this.worldPosition.y.sub(oldY)
        };

        //normalize
        let normalized = Utils.normalize(moveDelta.x, moveDelta.y);

        this.width = this.size.div(camera.range).toNumber() * appHeight;
        this.height = this.size.div(camera.range).toNumber() * appHeight;
        this.position = worldToScreenPoint(this.worldPosition.x, this.worldPosition.y);

        if(this.size.gt(player.size))
        {
            this.tint = Utils.colorToInt(128 + Math.floor(128 * Math.sin(this.lifeTime * 5)), 0, 0);
        }
        else
        {
            this.tint = this.color;
            if(!this.stationary)
            {
                this.width *= 1 + 0.1 * Math.cos(this.lifeTime * 2 * Math.PI);
                this.height *= 1 + 0.1 * Math.sin(this.lifeTime * 2 * Math.PI);
            }
        }

        if(normalized.x.equals(0) && normalized.y.equals(0))
        {
            this.rotation = 0;
        }
        else
        {
            this.rotation = Utils.rotationFromVector(normalized.x, normalized.y) + Math.PI;
        }
    }
}