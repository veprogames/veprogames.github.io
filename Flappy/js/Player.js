class Player
{
    constructor()
    {
        this.gravity = 2.5;
        this.gravitySpeed = 0;
        this.speed = 0;
        this.size = 0.075;
        this.dead = false;
        this.reset();
    }

    reset()
    {
        this.x = 0.05;
        this.y = 0.05;
        this.xSpeed = 0.3;
        this.gravitySpeed = 0;
        this.dead = false;
    }

    click()
    {
        if(!this.dead)
        {
            this.gravitySpeed = -0.75;
        }
    }

    die()
    {
        if(!this.dead)
        {
            player.gravitySpeed = -1.25;
            player.dead = true;
        }
    }

    tick(delta)
    {
        this.gravity = 2.5;
        this.xSpeed = 0.3;

        this.gravitySpeed += this.gravity * delta;
        this.y += this.gravitySpeed * delta;

        if (this.y < 0)
        {
            this.y = 0;
            this.gravitySpeed = 0;
        }
        else if (this.y > 0.85 && !this.dead)
        {
            this.y = 0.85;
            this.gravitySpeed = 0;
        }
    };

    render()
    {
        ctx.drawImage(images.player, player.x * h, player.y * h, this.size * h, this.size * h);
    }

    crashWith(otherobj)
    {
        let width = this.size * h;
        let height = this.size * h;

        let myleft = this.x * h;
        let myright = this.x * h + (width);
        let mytop = this.y * h;
        let mybottom = this.y * h + (height);
        let otherleft = otherobj.x * h;
        let otherright = otherobj.x * h + (otherobj.width * h);
        let othertop = otherobj.y * h;
        let otherbottom = otherobj.y * h + (otherobj.height * h);
        let crash = true;

        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright))
        {
            crash = false;
        }
        return crash;
    };

}
