  import axios from 'axios';

  const instance = axios.create({
    baseURL: 'https://absen.ft.uika-bogor.ac.id/api/',
    validateStatus: status => status < 500,
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
    },
    // timeout: 30,
  });

  export default instance;
