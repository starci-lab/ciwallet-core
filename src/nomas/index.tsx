//import { Swap } from "./components"
//import { PotfolioPage } from "./components/reusable/pages"
import { InitFunction } from "./components/reusable/functions"
import { SingletonHookProvider } from "./hooks/singleton"

export const Nomas = () => {
    return (
        <SingletonHookProvider>
            <InitFunction />
            {/* <Swap/>  */}
        </SingletonHookProvider>
    )
}
