import { InitPage, resolveAccountsThunk, resolveTokensThunk, Scene, setInitPage, setPassword, setScene, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { LaunchPage } from "./LaunchPage"
import { CreatePasswordPage } from "./CreatePasswordPage"
import { InputPasswordPage } from "./InputPasswordPage"
import { useEffect, useLayoutEffect } from "react"
import { SplashPage } from "./SplashPage"
import { encryptionObj } from "@/nomas/obj"

export const InitScene = () => {
    // retrieve init page from redux
    const initPage = useAppSelector((state) => state.stateless.pages.initPage)
    const initialized = useAppSelector((state) => state.persists.session.initialized)
    const dispatch = useAppDispatch()
    const sessionPassword = useAppSelector((state) => state.persists.session.sessionPassword)
    // if initialized, set init page to input password
    useLayoutEffect(() => {
        if (sessionPassword) {
            dispatch(setScene(Scene.Main))
            return
        }
        if (initialized) {
            dispatch(setInitPage(InitPage.InputPassword))
        }
    }, [initialized])
    const encryptedMnemonic = useAppSelector((state) => state.persists.session.encryptedMnemonic)   
    useEffect(() => {
        if (!sessionPassword) {
            return
        }
        const handleEffect = async () => {
            if (!encryptedMnemonic) {
                return
            }
            // 1. Try decrypt mnemonic with password
            await encryptionObj.decrypt(encryptedMnemonic, sessionPassword)
            // 2. Save password + redirect scene
            dispatch(setPassword(sessionPassword))
            // 3. Set thunk to resolve accounts
            await dispatch(resolveAccountsThunk())
            // 4. Update tokens
            await dispatch(resolveTokensThunk())
        }
        handleEffect()
    }, [sessionPassword])
    // render content based on init page
    const renderContent = () => {
        switch (initPage) {
        case InitPage.Launch:
            return <LaunchPage />
        case InitPage.CreatePassword:
            return <CreatePasswordPage />
        case InitPage.InputPassword:
            return <InputPasswordPage />
        case InitPage.Splash:
            return <SplashPage />
        }
    }
    // return render content
    return (
        <>{renderContent()}</>
    )
}