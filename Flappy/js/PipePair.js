class PipePair
{
    constructor(gap, type, moveSpeed = 0)
    {
        this.gap = gap;
        this.passed = false;
        this.moveSpeed = moveSpeed;
        this.moveDir = 1;

        let height = 0.6;

        let minY = -0.3;
        let maxY = 0.3;

        this.baseY = 0.5 - this.gap / 2 - height + (minY + Math.random() * 2 * maxY);
        this.width = 0.15;

        this.type = type;

        let pipe2y = this.baseY + 0.6 + this.gap;

        this.pipeTop = new Pipe(1, this.baseY, 0.6, this.width, this.type);
        this.pipeBottom = new Pipe(1, pipe2y, 0.6, this.width, this.type);
    }

    getCenter()
    {
        return this.pipeTop.y + this.pipeTop.height + this.gap / 2;
    }

    tick(delta)
    {
        if (this.getCenter() < 0.25)
        {
            this.pipeTop.y += 0.0025; //prevent twitching
            this.moveDir *= -1;
        }
        if (this.getCenter() > 0.75)
        {
            this.pipeTop.y -= 0.0025;
            this.moveDir *= -1;
        }
        this.pipeTop.y += this.moveSpeed * this.moveDir * delta;
        this.pipeBottom.y = this.pipeTop.y + 0.6 + this.gap;
        this.pipeTop.tick(delta);
        this.pipeBottom.tick(delta);
    }

    isPassed(player)
    {
        let playerSize = player.size * h;
        return player.x * h + playerSize / 2 >= this.pipeTop.x * h + this.width * h / 2 && !this.passed;
    }

    render()
    {
        let type = this.type;
        for (let i = 0; i < 2; i++)
        {
            ctx.drawImage(images.pipes, 128 * type, 0, 128, 512, this.pipeTop.x * h, this.pipeTop.y * h - this.pipeBottom.height * h * i,
                this.pipeTop.width * h, this.pipeTop.height * h);
            ctx.drawImage(images.pipes, 128 * type, 512, 128, 512, this.pipeBottom.x * h, this.pipeBottom.y * h + this.pipeBottom.height * h * i,
                this.pipeBottom.width * h, this.pipeBottom.height * h);
        }
    }
}