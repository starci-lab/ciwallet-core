import { InitPage, setInitPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { LaunchPage } from "./LaunchPage"
import { CreatePasswordPage } from "./CreatePasswordPage"
import { InputPasswordPage } from "./InputPasswordPage"
import { useLayoutEffect } from "react"

export const InitScene = () => {
    // retrieve init page from redux
    const initPage = useAppSelector((state) => state.stateless.pages.initPage)
    const initialized = useAppSelector((state) => state.persist.session.initialized)
    const dispatch = useAppDispatch()
    // if initialized, set init page to input password
    useLayoutEffect(() => {
        if (initialized) {
            dispatch(setInitPage(InitPage.InputPassword))
        }
    }, [initialized])
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
            return <div />
        }
    }
    // return render content
    return (
        <>{renderContent()}</>
    )
}
