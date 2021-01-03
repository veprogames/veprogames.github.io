class IdleMineNotation extends ADNotations.Notation
{
    get name()
    {
        return "Idle Mine Notation"
    }

    get suffixes()
    {
        return ["", "b", "qt", "o", "ud", "qd", "sd", "v", "tv", "sv", "nv", "dt"];
    }

    formatDecimal(value, places)
    {
        return this.format(value, places, places);
    }

    format(value, places, below1000)
    {
        value = new Decimal(value);
        let log = Decimal.log10(value);
        let order = Math.max(0, Math.floor((log - 1) / 9));
        if(order < this.suffixes.length)
        {
            let s = this.suffixes[order];
            let digits = order > 0 ? places : below1000;
            return Decimal.pow(10, (log - 1) % 9).mul(10).toNumber()
                .toLocaleString("en-us", {minimumFractionDigits: digits, maximumFractionDigits: digits}) + s;
        }
        return new ADNotations.StandardNotation().formatDecimal(value, places);
    }
}

class SINotationNew extends ADNotations.Notation
{
    get name()
    {
        return "SI Notation (2022)";
    }

    get suffixesLong()
    {
        return ["", "Kilo", "Mega", "Giga", "Tera", "Peta", "Exa", "Zetta", "Yotta", "Ronna", "Quecca"];
    }

    get suffixesShort()
    {
        return ["K", "M", "G", "T", "P", "E", "Z", "Y", "R", "Q"];
    }

    makeSuperScriptNumber(num)
    {
        let nums = "⁰¹²³⁴⁵⁶⁷⁸⁹";
        let res = "";
        for(let c of num.toFixed(0).toString())
        {
            res += nums[parseInt(c)];
        }
        return res;
    }

    formatDecimal(value, places)
    {
        return this.format(value, places, places);
    }

    format(value, places, below1000)
    {
        value = new Decimal(value);
        if(value.lt(1000))
        {
            return value.toFixed(below1000);
        }
        let mantissa = Decimal.pow(10, Decimal.log10(value) % 3);
        if(value.e < this.suffixesLong.length * 3)
        {
            return mantissa.toFixed(places) + " " + this.suffixesLong[Math.floor(value.e / 3)];
        }
        let order = Math.floor((value.e - 3) / (3 * this.suffixesShort.length));
        let result = mantissa.toFixed(places) + " " + this.suffixesShort[Math.floor(value.e / 3 - 1) % this.suffixesShort.length];
        if(order > 0)
        {
            let lastChar = this.suffixesShort[this.suffixesShort.length - 1];
            result += order > 5 ? (lastChar + this.makeSuperScriptNumber(order)) : lastChar.repeat(order);
        }
        return result;
    }
}

class SINotationCurrent extends SINotationNew
{
    get name()
    {
        return "SI Notation (Current)";
    }
    get suffixesLong()
    {
        return ["", "Kilo", "Mega", "Giga", "Tera", "Peta", "Exa", "Zetta", "Yotta"];
    }

    get suffixesShort()
    {
        return ["K", "M", "G", "T", "P", "E", "Z", "Y"];
    }
}