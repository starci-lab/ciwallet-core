import { type Dispatch, type SetStateAction } from "react"
import { type BareFetcher, type SWRConfiguration, type SWRResponse } from "swr"
import type { SWRMutationResponse } from "swr/mutation"

export interface UseSWR<TData, TChangeState = undefined> {
  swr: SWRResponse<
    TData,
    Error,
    SWRConfiguration<TData, Error, BareFetcher<TData>> | undefined
  >
  //function to change the state, if needed
  setParams?: Dispatch<SetStateAction<TChangeState>>
  params?: TChangeState
}

export interface UseSWRMutation<TData, ExtraArg = never> {
  swrMutation: SWRMutationResponse<TData, Error, string, ExtraArg>
}
