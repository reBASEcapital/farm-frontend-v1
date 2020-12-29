import { Yam } from '../../yam'

import { bnToDec } from '../../utils'

import {
  getCurrentPrice as gCP,
  getTargetPrice as gTP,
  getCirculatingSupply as gCS,
  getNextRebaseTimestamp as gNRT,
  getTotalSupply as gTS,
  getScalingFactor,
} from '../../yamUtils'

const getCurrentPrice = async (yam: typeof Yam): Promise<number> => {
  // FORBROCK: get current YAM price
  return gCP(yam)
}

const getTargetPrice = async (yam: typeof Yam): Promise<number> => {
  // FORBROCK: get target YAM price
  return gTP(yam)
}

const getCirculatingSupply = async (yam: typeof Yam): Promise<string> => {
  // FORBROCK: get circulating supply
  return gCS(yam)
}

const getNextRebaseTimestamp = async (yam: typeof Yam): Promise<number> => {
  // FORBROCK: get next rebase timestamp
  const nextRebase = await gNRT(yam) as number
  return nextRebase * 1000
}

const getTotalSupply = async (yam: typeof Yam): Promise<string> => {
  // FORBROCK: get total supply
  return gTS(yam)
}


export const getStats = async (yam: typeof Yam) => {
  const curPrice = await getCurrentPrice(yam)
  const circSupply = '' // await getCirculatingSupply(yam)
  const nextRebase = await getNextRebaseTimestamp(yam)
  const rawScalingFactor = await getScalingFactor(yam)
  const scalingFactor = Number(bnToDec(rawScalingFactor).toFixed(2))
  const targetPrice = await getTargetPrice(yam)
  const totalSupply = await getTotalSupply(yam)
  return {
    circSupply,
    curPrice,
    nextRebase,
    scalingFactor,
    targetPrice,
    totalSupply
  }
}

export const addHours = function(date, h) {
  date.setTime(date.getTime() + (h*60*60*1000));
  return date;
}

export function getCountDownInterval(date) {
  let x = setInterval(function() {
    const now = new Date().getTime();
    const distance = date.getTime() - now;
    // Time calculations for days, hours, minutes and seconds
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // If the count down is finished, write some text
    const element = document.getElementById("dashboard_countdown");
    if (distance < 0 && element) {
      clearInterval(x);
      element.innerHTML = 'REBASE';
    } else {
      if (!document.getElementById("dashboard_countdown")) {
        clearInterval(x);
      } else {
        if (
          element &&
          !isNaN(hours) &&
          !isNaN(minutes) &&
          !isNaN(seconds)
        ) {
          element.innerHTML =
            `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        }
      }
    }
  }, 1000);

  return x;
}