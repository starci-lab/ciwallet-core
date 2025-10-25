import React, { useEffect } from "react"
import { Scene, setInitialized, setScene, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "../../extends"

export const SettingsScene = () => {
    const dispatch = useAppDispatch()
    const initialized = useAppSelector((state) => state.persists.session.initialized)
    useEffect(() => {
        if (!initialized) {
            dispatch(setInitialized(true))
        }
    }, [])

    return (
        <NomasCard variant={NomasCardVariant.Gradient} className="w-full">
            <NomasCardHeader title="Settings" showBackButton onBackButtonPress={() => dispatch(setScene(Scene.Main))} />
            <NomasCardBody>
                <div className="text text-sm">Settings</div>
            </NomasCardBody>
        </NomasCard>
    )
}