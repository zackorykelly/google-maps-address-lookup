const axios = require('axios');
const util = require('util');
require('dotenv').config();

async function getNeighborhood(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const response = await axios.get(url);
  const results = response.data.results;
  // console.log(util.inspect(results, { depth: null }));
  if (results.length > 0) {
    const addressComponents = results[0].address_components;
    let result = null;
    let addressComponentsResult = [];
    for (let i = 0; i < addressComponents.length; i++) {
      addressComponentsResult.push(addressComponents[i]);
      const types = addressComponents[i].types;
      if (types.includes('neighborhood')) {
        result = addressComponents[i].long_name;
      }
    }
    return [result, addressComponentsResult, results[0].formatted_address];
  }
  return null;
}

// Change address to test here:
const address = '2625 Hemlock St, Vancouver, BC V6H 1K, Canada'
getNeighborhood(address)
  .then((result) => {
    console.log('------------------------------------------------------------')
    console.log('Entered Address: ', address);
    console.log('Formatted Address: ', (result[2] || 'No formatted address found!'));
    console.log('Neighborhood: ', (result[0] || 'No neighborhood found!'));
    console.log('------------------------------------------------------------')
    console.log('Address Components: ');
    for (const component of result[1]) {
      console.log(component.long_name, component.types);
    }
    console.log('------------------------------------------------------------')
  })
  .catch((error) => {
    console.error(error);
  });