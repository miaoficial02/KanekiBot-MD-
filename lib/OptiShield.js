import axios from 'axios';

async function optishield(params) {
  const apiURL = "http://optishield.zapto.org:34093/api/";
  const response = await axios.get(apiURL, { params });
  return response.data;
}

export { optishield };
