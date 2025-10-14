import { HomeSelectorTab, selectSelectedAccountByChainId, selectTokenById, setHomeSelectorTab, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasImage, NomasInput, NomasSpacer } from "../../../../../extends"
import { TooltipTitle } from "@/nomas/components"
import { generateAvatarURL } from "@cfx-kit/wallet-avatar"
import { shortenAddress } from "@ciwallet-sdk/utils"
import { CaretDownIcon, WalletIcon } from "@phosphor-icons/react"
import useSWR from "swr"
import { useBalance } from "@ciwallet-sdk/hooks"
import { useEffect } from "react"
import { useTransferFormik } from "@/nomas/hooks"

export const WithdrawalFunction = () => {
    const accountsMap = useAppSelector((state) => state.persists.session.accounts)
    const chainId = useAppSelector((state) => state.persists.session.chainId)
    const selectedFromAccountId = useAppSelector((state) => state.stateless.sections.home.selectedFromAccountId)
    const selectedFromAccount = useAppSelector((state) => selectSelectedAccountByChainId(state.persists, chainId))
    const accounts = accountsMap[chainId]?.accounts || []
    const fromAccount = accounts.find((account) => account.id === selectedFromAccountId) || selectedFromAccount
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedTokenId = useAppSelector((state) => state.stateless.sections.home.selectedTokenId)
    const token = useAppSelector((state) => selectTokenById(state.persists, selectedTokenId))
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const { handle } = useBalance()
    const formik = useTransferFormik()
    // we need to set the from address and encrypted private key
    useEffect(() => {
        formik.setFieldValue("fromAddress", fromAccount?.accountAddress)
        formik.setFieldValue("encryptedPrivateKey", fromAccount?.encryptedPrivateKey)
    }, [fromAccount])

    useEffect(() => {
        formik.setFieldValue("tokenAddress", token?.address)
    }, [token])

    // we need to set the balance
    const { data } = useSWR(
        ["potfolio-balance", token?.address, chainId, token?.address],
        async () => {
            const { amount } = await handle({
                chainId,
                network,
                address: fromAccount?.accountAddress || "",
                tokenAddress: token.address,
                decimals: token.decimals,
                rpcs: rpcs[chainId][network],
            })
            return amount
        }
    )

    // we need to set the balance
    useEffect(() => {
        formik.setFieldValue("balance", data)
    }, [data])

    // we need to set the token id
    if (!fromAccount) throw new Error("From account not found")
    return (
        <>
            <NomasCardHeader
                title="Withdrawal"
            />
            <NomasCardBody>
                <div>
                    <TooltipTitle title="From" size="sm" />
                    <NomasSpacer y={2}/>
                    <NomasCard variant={NomasCardVariant.Button}>
                        <NomasCardBody className="p-4 flex justify-between items-center">
                            <div className="flex flex-row items-center gap-2">
                                <NomasImage src={fromAccount.avatarUrl || generateAvatarURL(fromAccount.accountAddress)} className="w-10 h-10 rounded-full" />
                                <div>
                                    <div className="text-sm text">{fromAccount.name}</div>
                                    <div className="text-xs text-muted">{shortenAddress(fromAccount.accountAddress)}</div>
                                </div>
                            </div>
                            <CaretDownIcon className="w-5 h-5 text-muted" />
                        </NomasCardBody>
                    </NomasCard>
                </div>
                <NomasSpacer y={4}/>
                <div>
                    <TooltipTitle title="To" size="sm" />
                    <NomasSpacer y={2}/>
                    <NomasInput
                        placeholder="Enter user address"
                        value={formik.values.toAddress}
                        onValueChange={(value) => {
                            formik.setFieldValue("toAddress", value)
                        }}
                        errorMessage={formik.errors.toAddress}
                        onBlur={() => {
                            formik.setFieldTouched("toAddress")
                        }}
                        isInvalid={!!(formik.errors.toAddress && formik.touched.toAddress)}
                    />
                </div>
                <NomasSpacer y={4}/>
                <div>
                    <div className="flex justify-between items-center">
                        <TooltipTitle title="Amount" size="sm" />
                        <div className="flex gap-1">
                            <WalletIcon className="w-5 h-5 text-muted" weight="fill" />
                            <div className="text-muted text-sm">{data ?? "--"}</div>
                            <div className="text-muted text-sm">{token.symbol}</div>
                        </div>
                    </div>
                    <NomasSpacer y={2}/>
                    <NomasInput
                        placeholder="Enter amount"
                        numericOnly
                        value={formik.values.amount.toString()}
                        onValueChange={(value) => {
                            formik.setFieldValue("amount", value)
                        }}
                        onBlur={() => {
                            formik.setFieldTouched("amount")
                        }}
                        errorMessage={formik.errors.amount}
                        isInvalid={!!(formik.errors.amount && formik.touched.amount)}
                    />
                </div>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton className="w-full"
                    isDisabled={!formik.isValid}
                    isLoading={formik.isSubmitting}
                    onClick={() => {
                        formik.submitForm()
                    }}>
                    Send
                </NomasButton>
            </NomasCardFooter>
        </>
    )
}