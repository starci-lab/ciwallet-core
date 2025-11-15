import { 
    NomasDropdown, 
    NomasDropdownMenuItem, 
    NomasDropdownContent, 
    NomasDropdownTrigger,
} from "@/nomas/components"
import React, { useMemo } from "react"
import { usePlacePerpOrderFormik } from "@/nomas/hooks"
import { hyperliquidObj } from "@/nomas/obj"
import { useAppSelector } from "@/nomas/redux"

export const SizeDropdown = () => {
    const formik = usePlacePerpOrderFormik()
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const assetMetadata = useMemo(() => hyperliquidObj.getAssetMetadata(selectedAssetId), [selectedAssetId])
    return (
        <NomasDropdown>
            <NomasDropdownTrigger>
                {
                    formik.values.useUsdc ? "USDC" : assetMetadata.coin
                }
            </NomasDropdownTrigger>
            <NomasDropdownContent>
                <NomasDropdownMenuItem 
                    className="text-sm" 
                    onClick={() => {
                        formik.setFieldValue("useUsdc", true)
                    }}>USDC</NomasDropdownMenuItem>
                <NomasDropdownMenuItem 
                    className="text-sm" 
                    onClick={() => {
                        formik.setFieldValue("useUsdc", false)
                    }}>{assetMetadata.coin}</NomasDropdownMenuItem>
            </NomasDropdownContent>
        </NomasDropdown>
    )
}