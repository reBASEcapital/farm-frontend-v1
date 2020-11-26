import Axios from 'axios';

const http = Axios.create({
    baseURL: 'http://52.33.23.161:3000/api',
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
  });
  

  export function getLogs() {
    return http
      .get(
        '/get_logs'
      )
      .then((res) => {
          return res;
      });
    }