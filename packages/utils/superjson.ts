import SuperJSON from "superjson"
import BN from "bn.js"

SuperJSON.registerCustom<BN, string>(
    {
        isApplicable: (v): v is BN => {
            try {
                return BN.isBN(v)
            } catch {
                return false
            }
        },
        serialize: (v) => v.toString(),
        deserialize: (v) => new BN(v),
    }, "bn.js" // identifier
)

export { SuperJSON }