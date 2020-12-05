//describes a layer of universe Upgrade
class Universelayer
{
    constructor(name, resource)
    {
        this.name = name;
        this.upgrades = [];
        this.resource = resource;
        this.generateUpgrades();
    }

    generateUpgrades()
    {
        let layersUnlockedSoFar = functions.universeLayersUnlocked() + 1;
        this.upgrades.push(new UniverseUpgrade("Rho Fortification", "All Generators produce more Rho-Particles",
            level => Decimal.pow(1.9, level).floor(),
            level => Decimal.pow(2 + 0.25 * Math.min(3, layersUnlockedSoFar - 1), level),
            this.resource, UPGRADE_RHO),
            new UniverseUpgrade("Shrinking and Emsmalling", "All Generators shrink stronger",
                level => Decimal.pow(1.6, level).floor(),
                level => new Decimal(1 + (0.6 + 0.4 * Math.min(3, layersUnlockedSoFar)) * level), this.resource, UPGRADE_SHRINKPOWER,{
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            new UniverseUpgrade("More Power, more Rho", "All Generators produce more Rho-Particles based on total Verses shrunk",
                level => Decimal.pow(8, level).mul(32),
                level => level > 0 ? this.resource.totalAmount.pow(0.2 + 0.05 * level) : new Decimal(1), this.resource, RHO_BOOST_RESOURCE),
            new UniverseUpgrade("Going small with Power", "All Generators shrink faster based on shrunk Verses you have right now",
                level => Decimal.pow(32, level).mul(512),
                level => level > 0 ? new Decimal(1 + Decimal.log10(this.resource.amount.add(1)) * (0.2 + 0.04 * level * layersUnlockedSoFar)) : new Decimal(1), this.resource, SHRINK_BOOST_RESOURCE, {
                    maxLevel: 10,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }));
    }
}