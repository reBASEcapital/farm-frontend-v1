import {ethers} from 'ethers'

import BigNumber from 'bignumber.js'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 425000,
    SNX: 850000,
  }
};

export const getPoolStartTime = async (poolContract) => {
  return await poolContract.methods.starttime().call()
}

export const stake = async (poolContract, amount, account, tokenName) => {
  let now = new Date().getTime() / 1000;
  const gas = GAS_LIMIT.STAKING[tokenName.toUpperCase()] || GAS_LIMIT.STAKING.DEFAULT;
  if (now >= 1597172400) {
    return poolContract.methods
      .stake((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString(), [])
      .send({ from: account, gas })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}
export const totalStaked = async( poolContract ) => {

  let obj = await poolContract.methods.totalStaked().call()
  let totalStaked = new BigNumber( obj );
  return totalStaked;
}


export const unstake = async (poolContract, amount, account) => {
  let now = new Date().getTime() / 1000;
  const gas = GAS_LIMIT.STAKING.DEFAULT;

  if (now >= 1597172400) {
    const newAmount = (new BigNumber(amount).times(new BigNumber(10).pow(18))).toFixed(0)
    return poolContract.methods
      .unstake( newAmount, [])
      .send({ from: account, gas })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const rebaseHarvest = async (poolContract, amount, account) => {
  let now = new Date().getTime() / 1000;
  const gas = GAS_LIMIT.STAKING.DEFAULT;

  if (now >= 1597172400) {
    const newAmount = (new BigNumber(amount).times(new BigNumber(10).pow(18))).toFixed(0)
    return poolContract.methods
        .unstake( newAmount, [])
        .send({ from: account, gas })
        .on('transactionHash', tx => {
          console.log(tx)
          poolContract.methods
              .stake( newAmount, [])
              .send({ from: account, gas })
              .on('transactionHash', tx => {
                console.log(tx)
                return tx.transactionHash
              })
        })
  } else {
    alert("pool not active");
  }
}

export const harvest = async (poolContract, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return poolContract.methods
      .getReward()
      .send({ from: account, gas: 200000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const redeem = async (poolContract, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return poolContract.methods
      .exit()
      .send({ from: account, gas: 400000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const approve = async (tokenContract, poolContract, account) => {
  return tokenContract.methods
    .approve(poolContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gas: 80000 })
}

export const getPoolContracts = async (yam) => {
  return yam.contracts.pools
}

export const getEarned = async (yam, pool, account) => {
  const scalingFactor = new BigNumber(await yam.contracts.yam.methods.yamsScalingFactor().call())
  const earned = new BigNumber(await pool.methods.earned(account).call())
  return earned.multipliedBy(scalingFactor.dividedBy(new BigNumber(10).pow(18)))
}

export const getStaked = async (yam, pool, account) => {
  return yam.toBigN(await pool.methods.totalStakedFor(account).call())
}

export const getCurrentPrice = async (yam) => {
  // FORBROCK: get current YAM price
  return yam.toBigN(await yam.contracts.rebaser.methods.getCurrentTWAP().call())
}

export const getTargetPrice = async (yam) => {
  return yam.toBigN(1).toFixed(2);
}

export const getCirculatingSupply = async (yam) => {
  let now = await yam.web3.eth.getBlock('latest');
  let scalingFactor = yam.toBigN(await yam.contracts.yam.methods.yamsScalingFactor().call());
  let starttime = yam.toBigN(await yam.contracts.eth_pool.methods.starttime().call()).toNumber();
  let timePassed = now["timestamp"] - starttime;
  if (timePassed < 0) {
    return 0;
  }
  let yamsDistributed = yam.toBigN(8 * timePassed * 250000 / 625000); //yams from first 8 pools
  let starttimePool2 = yam.toBigN(await yam.contracts.ycrv_pool.methods.starttime().call()).toNumber();
  timePassed = now["timestamp"] - starttime;
  let pool2Yams = yam.toBigN(timePassed * 1500000 / 625000); // yams from second pool. note: just accounts for first week
  let circulating = pool2Yams.plus(yamsDistributed).times(scalingFactor).div(10**36).toFixed(2)
  return circulating
}

export const getNextRebaseTimestamp = async (yam) => {
  try {
    let now = await yam.web3.eth.getBlock('latest').then(res => res.timestamp);
    let interval = 43200; // 12 hours
    let offset = 28800; // 8am/8pm utc
    let secondsToRebase = 0;
    if (await yam.contracts.rebaser.methods.rebasingActive().call()) {
      if (now % interval > offset) {
          secondsToRebase = (interval - (now % interval)) + offset;
       } else {
          secondsToRebase = offset - (now % interval);
      }
    } else {
      let twap_init = yam.toBigN(await yam.contracts.rebaser.methods.timeOfTWAPInit().call()).toNumber();
      if (twap_init > 0) {
        let delay = yam.toBigN(await yam.contracts.rebaser.methods.rebaseDelay().call()).toNumber();
        let endTime = twap_init + delay;
        if (endTime % interval > offset) {
            secondsToRebase = (interval - (endTime % interval)) + offset;
         } else {
            secondsToRebase = offset - (endTime % interval);
        }
        return endTime + secondsToRebase;
      } else {
        return now + 13*60*60; // just know that its greater than 12 hours away
      }
    }
    return secondsToRebase
  } catch (e) {
    console.log(e)
  }
}

export const getTotalSupply = async (yam) => {
  return await yam.contracts.yam.methods.totalSupply().call();
}

export const getStats = async (yam) => {
  const curPrice = await getCurrentPrice(yam)
  const circSupply = await getCirculatingSupply(yam)
  const nextRebase = await getNextRebaseTimestamp(yam)
  const targetPrice = await getTargetPrice(yam)
  const totalSupply = await getTotalSupply(yam)
  return {
    circSupply,
    curPrice,
    nextRebase,
    targetPrice,
    totalSupply
  }
}

export const vote = async (yam, account) => {
  return yam.contracts.gov.methods.castVote(0, true).send({ from: account })
}

export const delegate = async (yam, account) => {
  return yam.contracts.yam.methods.delegate("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({from: account, gas: 320000 })
}

export const didDelegate = async (yam, account) => {
  return await yam.contracts.yam.methods.delegates(account).call() === '0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84'
}

export const getVotes = async (yam) => {
  const votesRaw = new BigNumber(await yam.contracts.yam.methods.getCurrentVotes("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").call()).div(10**24)
  return votesRaw
}

export const getScalingFactor = async (yam) => {
  return new BigNumber(await yam.contracts.yam.methods.yamsScalingFactor().call())
}

export const getDelegatedBalance = async (yam, account) => {
  return new BigNumber(await yam.contracts.yam.methods.balanceOfUnderlying(account).call()).div(10**24)
}

export const migrate = async (yam, account) => {
  return yam.contracts.yamV2migration.methods.migrate().send({ from: account, gas: 320000 })
}

export const getMigrationEndTime = async (yam) => {
  return yam.toBigN(await yam.contracts.yamV2migration.methods.startTime().call()).plus(yam.toBigN(86400*3)).toNumber()
}

export const getV2Supply = async (yam) => {
  return new BigNumber(await yam.contracts.rebase.methods.totalSupply().call())
}


export const getTotalLocked = async (rebasePool) => {
  return new BigNumber(await rebasePool.methods.totalLocked().call()).div(10**9)
}

export const getTotalLockedShares = async (rebasePool) => {
  return new BigNumber(await rebasePool.methods.totalLockedShares().call())
}

export const getUnlockSchedulesCount = async (rebasePool) => {
  return  await rebasePool.methods.unlockScheduleCount().call()
}

export const getUnlockSchedules = async (rebasePool, index) => {
  return  await rebasePool.methods.unlockSchedules(index).call()
}


export const getTotalStakingShares= async (rebasePool) => {
  return  await rebasePool.methods.totalStakingShares().call()
}

export const getUpdateAccounting= async (rebasePool) => {
  return  await rebasePool.methods.updateAccounting().call()
}

export const getUnstakeQuery= async (rebasePool, balance, account) => {
  return   await rebasePool.methods.unstakeQuery(balance.toString()).call({from: account});
}


export const getUnlockRate = async (rebasePool, seconds) => {
  const totalLocked = await getTotalLocked(rebasePool);
  const totalLockedShares = await getTotalLockedShares(rebasePool);
  const unlockScheduleCount = await getUnlockSchedulesCount(rebasePool);
  const now = parseInt(Date.now() /1000);
  const p = [];
  for (let i=0;i<unlockScheduleCount;i++){
    p.push(await getUnlockSchedules(rebasePool,i))
  }
  return  new BigNumber(p.reduce((t, e) => (t += Math.min(Math.max(e.endAtSec - now, 0), seconds) / e.durationSec * e.initialLockedShares) && t, 0)).div( totalLockedShares).multipliedBy( totalLocked).toNumber();

}

export const getEstimatedReward = (seconds, amount, totalStakingShares,totalStaked, updatedValues, unlockRate, userStaked ) => {
  let totalStakingShareSeconds = new BigNumber(updatedValues[3]);
  let stakingShareSeconds = new BigNumber(updatedValues[2]);
  let bTotalStakingShares = new BigNumber(totalStakingShares)
  let bUserStaked = new BigNumber(userStaked)
  let bSeconds = new BigNumber(seconds)
  let bTotalStaked = new BigNumber(totalStaked)
  let bAmount = new BigNumber(amount)
  let i = bUserStaked.multipliedBy(bTotalStakingShares).dividedBy( (bTotalStaked.dividedBy(1000000000000000000)));
  let o = bAmount.multipliedBy(bTotalStakingShares).dividedBy( (bTotalStaked.dividedBy(1000000000000000000)));
  let a = stakingShareSeconds.plus( (i.plus( o)).multipliedBy( bSeconds)).dividedBy( totalStakingShareSeconds.plus( (bTotalStakingShares.plus(o).multipliedBy( bSeconds))));
  return  unlockRate * a.toNumber()
}


export const getSubtractEstimatedReward = (seconds, amount, totalStakingShares,totalStaked, updatedValues, unlockRate, userStaked ) => {
  let totalStakingShareSeconds = new BigNumber(updatedValues[3]).toNumber();
  let stakingShareSeconds = new BigNumber(updatedValues[2]).toNumber();
  let i = userStaked  * totalStakingShares / (totalStaked/1000000000000000000);
  let o = amount  * totalStakingShares / (totalStaked/1000000000000000000),
      a = (stakingShareSeconds + (i - o) * seconds) / (totalStakingShareSeconds + (totalStakingShares + o) * seconds);
  return  unlockRate * a
}





