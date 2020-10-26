import BigNumber from 'bignumber.js'

export const getPrice = (numerator: string, denominator: string ) => {
    const numeratorBN = new BigNumber(numerator);
    const denominatorBN = new BigNumber(denominator);

    if ( numeratorBN.isGreaterThan( 0 ) && denominatorBN.isGreaterThan ( 0 ))
    {
        const displayPrice = numeratorBN.dividedBy(denominatorBN);
        return displayPrice.toFixed(2)
    }
}

export const getTotalStakedValue = (totalValueBN: BigNumber, totalUniswapBN: BigNumber, totalGeyserBN: BigNumber ) => {

    if ( totalValueBN && totalValueBN.isGreaterThan( 0 ) && totalUniswapBN && totalUniswapBN.isGreaterThan ( 0 ) && totalGeyserBN && totalGeyserBN.isGreaterThan ( 0 ))
    {
        const totalStakedValue = totalGeyserBN.dividedBy(totalUniswapBN).multipliedBy(totalValueBN);
        return totalStakedValue.toFixed(2)
    }
}
