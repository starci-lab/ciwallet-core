import { InitPage, useAppSelector } from "@/nomas/redux"
import { LaunchPage } from "./LaunchPage"
import { CreatePasswordPage } from "./CreatePasswordPage"

export const InitFunction = () => {
    // retrieve init page from redux
    const initPage = useAppSelector((state) => state.stateless.pages.initPage)
    // render content based on init page
    const renderContent = () => {
        switch (initPage) {
        case InitPage.Launch:
            return <LaunchPage />
        case InitPage.CreatePassword:
            return <CreatePasswordPage />
        case InitPage.Splash:
            return <div />
        }
    }
    const accounts = useAppSelector(state => state.persits.session.accounts)
    console.log("accounts", accounts)
    // return render content
    return (
        <>{renderContent()}</>
    )
}