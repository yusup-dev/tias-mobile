import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://n796ctp1-8000.asse.devtunnels.ms/api/',
  validateStatus: status => status < 500,
  headers: {
    'Content-Type': 'application/json',
    "Accept": "application/json",
  },
  // timeout: 30,
});

export default instance;
