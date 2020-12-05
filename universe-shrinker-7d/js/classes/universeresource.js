class UniverseResource
{
    constructor(name)
    {
        this.name = name;
        this.amount = new Decimal(0);
        this.maxAmount = new Decimal(0);
        this.totalAmount = new Decimal(0);
    }

    addResource(n)
    {
        //this.amount = this.amount.add(n);
        Vue.set(this, "amount", this.amount.add(n));
        Vue.set(this, "totalAmount", this.totalAmount.add(n));
        Vue.set(this, "maxAmount", Decimal.max(this.amount, this.maxAmount));
        //this.totalAmount = this.totalAmount.add(n);
        //this.maxAmount = Decimal.max(this.amount, this.maxAmount);
    }

    load()
    {
        this.amount = new Decimal(this.amount);
        this.totalAmount = new Decimal(this.totalAmount);
        this.maxAmount = new Decimal(this.maxAmount);
        return this;
    }
}