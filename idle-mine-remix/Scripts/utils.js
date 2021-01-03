class Utils
{
    static generateWord(seed, length)
    {
        let vowels = "aeiou".split("");
        let consonants = "bcdfghjklmnpqrstvwxyz".split("");
        let str = "";
        for(let i = 0; i < length; i++)
        {
            let freq = Math.sin(20000 * seed) > 0 ? 3 : 2;
            let collection = i % freq === 0 ? vowels : consonants;
            str += collection[Math.floor((0.5 + 0.5 * Math.sin(seed * 5172 + 13451 * seed * i * i)) * collection.length)];
        }

        str = str[0].toUpperCase() + str.slice(1);

        return str;
    }

    static generateMineObjectName(seed, length)
    {
        let n = Utils.generateWord(seed, length);
        n += Math.sin(45123 * seed) > -0.5 ? "ium" : Math.sin(254235 * seed) > -0.5 ? "lite" : "";
        return n;
    }

    static generateColor(seed)
    {
        return "#" + [(128 + 128 * Math.sin(seed * 51321)), (128 + 128 * Math.sin(seed * 45218)), (128 + 128 * Math.sin(seed * 94125))]
            .map(val => val = ("0" + Math.floor(val).toString(16)).slice(-2)).join("");
    }

    static roundBase(d, digits)
    {
        d.m = Math.round(d.m * Math.pow(10, digits)) / Math.pow(10, digits);
        return d;
    }

    static choose()
    {
        return arguments[Math.floor(Math.random() * arguments.length)];
    }

    static seededChoose(seed, args)
    {
        return args[Math.floor(args.length / 2 + args.length / 2 * Math.sin(seed * 123 + 175))];
    }

    static keyPressed(k)
    {
        return keymap.includes(k);
    }

    static keysPressed(keys)
    {
        for(let k of keys)
        {
            if(!keymap.includes(k))
            {
                return false;
            }
        }
        return true;
    }
}