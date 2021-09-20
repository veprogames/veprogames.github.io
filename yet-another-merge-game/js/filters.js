Vue.filter("fnum", (value, prec, precLim, lim) => functions.formatNumber(value, prec, precLim, lim));
Vue.filter("ftnum", value => functions.formatThousands(value));
Vue.filter("fpnum", value => functions.formatPercent(value));