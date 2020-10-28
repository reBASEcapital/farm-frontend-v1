import BigNumber from 'bignumber.js'

export const getTotalValue = (rebaseTotal: string, usdCTotal: string, rebasePrice: string ) => {
    const rebaseTotalBN = new BigNumber(rebaseTotal);
    const usdcTotalBN = new BigNumber(usdCTotal);
    const rebasePriceBN = new BigNumber(rebasePrice);

    if ( rebaseTotalBN.isGreaterThan( 0 ) && usdcTotalBN.isGreaterThan ( 0 ) && rebasePriceBN.isGreaterThan( 0 ))
    {
        const totalValue = rebaseTotalBN.multipliedBy(rebasePriceBN).plus( usdcTotalBN);
        return totalValue
    }
}
