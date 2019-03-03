export default async function fetchFxRates() {
  // eslint-disable-next-line no-undef
  const res = await fetch('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
  const raw = await res.text();

  const re = /currency='\w{3}' rate='\d+.\d+'/g;
  const rates = raw
    .match(re)
    .map(rate => rate.split('\''))
    .reduce((acc, el) => {
      acc[el[1]] = Number(el[3]);
      return acc;
    }, {});

  return rates;
}
