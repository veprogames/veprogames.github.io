const prestigeThreshold = Decimal.pow(10, 24);

function getPrestigeGain (x) {
  x = x.max(1e3);
  let steps = x.log(prestigeThreshold) - 1;
  let gens = Math.log2(x.log(10));
  let pow = 8 * steps / gens;
  return Decimal.floor(Decimal.pow(10, pow));
}

const singularityUnlockExp = 1e4;

function getSingularityPowerEffect () {
  return 1 + 0.06 * (1 - Math.exp(-Math.log10(player.singularity.currencyAmount) / 8));
}

function getTranscensionGain()
{
  if(player.generators.length < 8)
  {
    return new Decimal(0);
  }
  return Decimal.pow(2, player.generators.length - 8);
}

function getTranscensionBoost()
{
  return Decimal.pow(player.transcension.points.mul(2).add(1), 1.4);
}

function getBoost (tier) {
  let ret = new Decimal(1);
  for (let i = tier + 1; i < player.generators.length; i++) {
    ret = ret.times(player.generators[i].currencyAmount.pow(i - tier));
  }
  return ret;
}

function getMult (i, j) {;
  return player.generators[i].list[j].mult.times(getBoost(i)).times(getTranscensionBoost()).pow(getSingularityPowerEffect());
}

function initializeTier () {
  player.generators.push(getInitialTier(player.generators.length));
}

function resetTier (i) {
  Vue.set(player.generators, i, getInitialTier(i));
}

function partialResetTier (i) {
  player.generators[i].currencyAmount = new Decimal(1);
  for (let j = 0; j < player.generators[i].list.length; j++) {
    player.generators[i].list[j].amount = new Decimal(player.generators[i].list[j].bought);
  }
}

function getInitialTier (i) {
  let r = {
    prestigeAmount: (i === 0) ? new Decimal(1) : new Decimal(0),
    prestigeName: getPrestigeCurrencyName(i),
    nextPrestigeName: getPrestigeCurrencyName(i + 1),
    displayName: getDisplayName(i),
    autoMaxAll: i < player.generators.length ? player.generators[i].autoMaxAll : false,
    prestigeGain: i < player.generators.length ? player.generators[i].prestigeGain : false,
    display: i < player.generators.length ? player.generators[i].display : true,
    list: [getInitialGenerator(i, 0)],
    tabColor: Math.floor(360 * Math.sin(i * 10000))
  }
  if (i !== 0) {
    r.currencyAmount = new Decimal(1);
    r.currencyName = getProducedCurrencyName(i);
  }
  return r;
}

function initializeGenerator (i) {
  player.generators[i].list.push(getInitialGenerator(i, player.generators[i].list.length));
}

function getInitialGenerator (i, j) {
  let numSuffix = j < 3 ? ["st", "nd", "rd"][j] : "th";

  return {
    cost: Decimal.pow(10, (j === 0) ? 0 : Math.pow(2, j)),
    mult: new Decimal(1),
    amount: new Decimal(0),
    bought: 0,
    generatorName: (j + 1) + numSuffix + " " + ((i === 0) ? '' : (getPrestigeName(i, title=true)) + " ") + 'Dimension'
  }
}

let prestiges = ['Infinity', 'Eternity', 'Quantum', 'Reality', "Super", "Ultrum", "Holy", 
                "Cosmic", "Ultimate", "Fundamental", "Divine", "Godly", "Hyperdrive", 
                "Transcendence", "Omniscience"];
let metaLevels = ["", "Meta-", "Eta-", "Zeta-", "Omega-"];

function getPrestigeCurrencyName (i) {
  if (i === 0) {
    return 'money';
  } else {
    return getPrestigeName(i) + ' points';
  }
}

function getProducedCurrencyName (i) {
  return getPrestigeName(i) + ' power';
}

function getPrestigeName (i, title=false) {
  let main = prestiges[(i + prestiges.length - 1) % prestiges.length];
  let metaLevel = Math.floor((i - 1) / prestiges.length);
  let metaOrder = Math.floor(metaLevel / metaLevels.length);
  let r;
  if(metaOrder == 0)
  {
    r = metaLevels[metaLevel % metaLevels.length] + main;
  }
  else
  {
    let m = (main + "ed ").repeat(metaOrder) + main;
    r = metaLevels[metaLevel % metaLevels.length] + m;
  }
  if (!title) {
    r = r.toLowerCase();
  }
  return r;
}

function getDisplayName (i) {
  if (i === 0) {
    return 'Normal';
  } else {
    return getPrestigeName(i, title=true);
  }
}

let player = {
  lastUpdate: Date.now(),
  lowTiers: Infinity,
  highTiers: Infinity,
  tab: 0,
  singularity: {
    unlocked: false,
    currencyAmount: 1
  },
  generators: [],
  transcension:
  {
    points: new Decimal(0)
  },
  currentTheme: 'default',
  pressedKeys: []
}

initializeTier();
