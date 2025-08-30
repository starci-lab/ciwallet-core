import BN from "bn.js"

export interface EncodedPoolInput {
  poolAddress: string;      // address pool
  zeroForOne: boolean;      // swap token0 → token1 hoặc token1 → token0
  unwrapWeth?: boolean;     // unwrap WETH
}

/**
 * Utility library for encoding Uniswap V3 pools
 * for AggregationRouterV5 contract - ENCODE ONLY
 */
export class UniswapV3PoolEncoder {

    // Bitmask constants
    private static readonly ADDRESS_MASK = new BN("ffffffffffffffffffffffffffffffffffffffff", 16) // 160 bits
    private static readonly ONE_FOR_ZERO_MASK = new BN("8000000000000000000000000000000000000000000000000000000000000000", 16) // bit 255
    private static readonly WETH_UNWRAP_MASK = new BN("2000000000000000000000000000000000000000000000000000000000000000", 16) // bit 253

    /**
   * Encode một pool đơn lẻ
   * @param poolAddress - address của pool (0x...)
   * @param zeroForOne - true: token0 → token1, false: token1 → token0
   * @param unwrapWeth - unwrap WETH hay không
   * @returns uint256 encoded dạng BigInt
   */
    public static encodePool(
        poolAddress: string,
        zeroForOne: boolean = true,
        unwrapWeth: boolean = false
    ): bigint {
        const addressBN = new BN(poolAddress.replace(/^0x/, ""), 16)
        let encoded = addressBN.and(this.ADDRESS_MASK) // giữ 160 bit địa chỉ

        if (!zeroForOne) encoded = encoded.or(this.ONE_FOR_ZERO_MASK)
        if (unwrapWeth) encoded = encoded.or(this.WETH_UNWRAP_MASK)

        return BigInt(encoded.toString(10))
    }

    /**
   * Encode mảng pools cho multi-hop swap
   * @param pools - array thông tin pools
   * @returns array encoded pools dưới dạng BigInt
   */
    public static encodePools(pools: Array<EncodedPoolInput>): Array<bigint> {
        return pools.map(pool => this.encodePool(
            pool.poolAddress,
            pool.zeroForOne,
            pool.unwrapWeth ?? false
        ))
    }
}