const ECB_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

export default async function fetchFxRates() {
  const res = await fetch(ECB_URL);
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
