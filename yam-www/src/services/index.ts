import Axios from 'axios';
import Environment from '../Environment';

const http = Axios.create({
    baseURL: Environment.dashboardEndpoint,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
  });
  

  export function getLogs() {
    return Axios.all([http.get( '/get_logs'), http.get( '/get_prices'), http.get( '/get_stimulus')])
    .then(Axios.spread((logsRes, pricesRes, stimulusRes) => {
      const uniswapPrices = pricesRes?.data.reduce((total, item) => {
        if(item.type === "UniswapPrice"){
          total[item.time.slice(0,16)] = item.price
        }
        return total
      }, {});
      const bikiPrices = pricesRes?.data.reduce((total,item) => {
        if(item.type === "BikiPrice"){
          total[item.time.slice(0,16)] = item.price
        }
        return total
      },{});
      return {logs: logsRes.data, uniswapPrices, bikiPrices, stimulus: stimulusRes.data};
    }));
  }

  export function getPrices() {
    return http
      .get(
        '/get_prices'
      )
      .then((res) => {
          return res;
      });
    }
    
  export function getTimes() {
    return http
      .get(
        '/get_times'
      )
      .then((res) => {
          return res;
      });
    }