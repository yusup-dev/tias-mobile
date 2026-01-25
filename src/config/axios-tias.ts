import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api-tias.ti.ft.uika-bogor.ac.id/',
  validateStatus: status => status < 500,
  // timeout: 30,
});

export default instance;
