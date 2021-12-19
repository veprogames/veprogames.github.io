class NumberFormatter
{
  static get NUMBER_PREFIXES()
  {
    return {
      start: ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"],
      ones: ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"],
      tens: ["Dc", "Vg", "Tg", "Qd", "Qg", "Sg", "St", "Og", "Ng"]
    };
  }

  static get LETTERS()
  {
    return ["~", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  }

  static format(n, type, precise)
  {
    let prec = precise === undefined ? false : precise;

    if (n === 0)
    {
      return 0;
    }
    else if (n < 0.01)
    {
      return "1 / " + this.format(1 / n, type, precise);
    }
    else if (n < 1)
    {
      return n.toFixed(2);
    }
    else if (n < 1000)
    {
      return n.toFixed(prec ? 2 : 0);
    }

    let mantissa = Math.pow(10, Math.log10(n) % 3).toFixed(2);

    if (type === 0) //standard
    {
      let suffix = Math.log10(n) < 36 ? this.NUMBER_PREFIXES.start[Math.floor(Math.log10(n) / 3)] :
        this.NUMBER_PREFIXES.ones[Math.floor(Math.log10(n) / 3 - 1) % this.NUMBER_PREFIXES.ones.length] + this.NUMBER_PREFIXES.tens[Math.floor(Math.log10(n / 1000) / 30 - 1)];

      return mantissa + suffix;
    }

    else if (type === 1) //sci
    {
      return (Math.pow(10, Math.log10(n) % 1)).toFixed(2) + "e" + Math.floor(Math.log10(n));
    }

    else if (type === 2) //engineering
    {
      return mantissa + "e" + Math.floor(Math.log10(n) / 3) * 3;
    }

    else if (type === 3)
    {
      let suffix = "";

      let letterAmount = this.LETTERS.length;

      let exp = Math.floor(Math.log10(n) / 3) * 3;
      let step = 3 * Math.pow(letterAmount, Math.floor(Math.log10(n) + 1) > 3 * letterAmount ? 1 : 0);

      while (step >= 3)
      {
        let index = Math.floor(exp / step);
        suffix += this.LETTERS[index];
        exp -= step * index;

        step /= letterAmount;
      }

      return mantissa + suffix;
    }

    else if (type === 4)
    {
      mantissa = Math.pow(2, Math.log(n) / Math.log(2) % 1).toFixed(2);
      let exp = Math.floor(Math.log(n) / Math.log(2));

      return mantissa + " * 2^" + exp;
    }
  }
}