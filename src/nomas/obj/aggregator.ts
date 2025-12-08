import { assetsConfig } from "../resources/assets"
import { envConfig } from "../env"
import { AggregatorId } from "@ciwallet-sdk/classes"
import { AggregatorManager } from "@ciwallet-sdk/classes"
export const aggregatorManagerObj = new AggregatorManager({
    lifi: {
        integrator: envConfig().lifi.integrator,
        apiKey: envConfig().lifi.apiKey,
    },
})
aggregatorManagerObj.injectIconUrl({
    aggregatorId: AggregatorId.Madhouse,
    iconUrl: assetsConfig().aggregator.madhouse.logo,
})
aggregatorManagerObj.injectIconUrl({
    aggregatorId: AggregatorId.Jupiter,
    iconUrl: assetsConfig().aggregator.jupiter.logo,
})
aggregatorManagerObj.injectIconUrl({
    aggregatorId: AggregatorId.Lifi,
    iconUrl: assetsConfig().aggregator.lifi.logo,
})
aggregatorManagerObj.injectIconUrl({
    aggregatorId: AggregatorId.Cetus,
    iconUrl: assetsConfig().aggregator.cetus.logo,
})
