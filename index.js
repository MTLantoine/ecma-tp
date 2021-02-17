import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

// Request
const request = async (method, url, target = null) => {
  try {
    const result = await axios({
      method: method,
      url: url,
    })
    return target ? result.data[target] : result.data;
  } catch(error) {
    return null;
  }
}

// Get cat
const getCats = async () => {
  return await request('get', 'https://cat-fact.herokuapp.com/facts/random?amount=3');
}

// Get fox
const getFox = async () => {
  return await request('get', 'https://randomfox.ca/floof/', 'image');
}

// Get holidays
const getHollidays = async (cp) => {
  return await request('get', `https://date.nager.at/api/v2/publicholidays/2021/${cp}`);
}

app.post('/', async (req, res) => {
  const fox = await getFox();
  const cats = await getCats();
  const holidays = await getHollidays(req.body.countryCode);

  return {
    foxPicture: fox,
    catFacts: cats === null ? cats : cats.map(cat => cat.text),
    holidays: holidays,
  };  
});  

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
