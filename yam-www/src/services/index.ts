import Axios from 'axios';
import Environment from '../Environment';

const http = Axios.create({
    baseURL: Environment.dashboardEndpoint,
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
    
  export function getTimeNextRebase() {
    return http
      .get(
        '/get_times'
      )
      .then((res) => {
          return res;
      });
    }
