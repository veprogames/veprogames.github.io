function formatThousands(n)
{
  let array = n.toString().match(/\d{1,3}(?=(\d{3})*(?!\d))/g)
  return array.join(",");
}

function format(amount, places=2) {
  amount = new Decimal(amount);
  let power = amount.exponent;
  let mantissa = amount.mantissa;
  if (power < places + 1) return amount.toFixed(places);
  if (power >= 1e9)
  {
    let p = Math.floor(Math.log10(power));
    let suffix = ["k", "m", "g", "t", "p", "e", "z", "y"][Math.floor((p - 9) / 3)];
    let m = Math.round(Math.pow(10, Math.log10(power) % 3) * 1e6);
    //return "e" + format(new Decimal(amount.log(10)));
    return "e" + formatThousands(m) + suffix;
  } 
  if (power >= 1e6) return "e" + formatThousands(power);
  if (power >= 1e3) return mantissa.toFixed(Math.max(0, places - 1)) + "e" + formatThousands(power);
  
  return mantissa.toFixed(places) + "e" + formatThousands(power);
}

function formatLong(x) {
  return format(x, places=5);
}

function formatWhole(x)
{
  if(x.lt(1e9))
  {
    return formatThousands(x.toNumber().toFixed(0));
  }
  return format(x);
}
