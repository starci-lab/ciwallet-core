import React, { useEffect, useRef } from "react"
import { 
    NomasButton, 
    NomasCard, 
    NomasCardBody, 
    NomasCardFooter, 
    NomasCardHeader, 
    NomasCardVariant, 
    NomasInput,
    NomasLink
} from "../../../extends"
import { useInputPasswordFormik } from "@/nomas/hooks"
import { NomasSpacer } from "../../../extends"
import { assetsConfig } from "@/nomas/resources"

export const InputPasswordPage = () => {
    const formik = useInputPasswordFormik()

    return (
        <NomasCard
            variant={NomasCardVariant.Gradient}
            isContainer
        >
            <NomasCardHeader title="Input Password" />
            <NomasCardBody className="flex flex-col items-center">
                <div className="w-full bg-card-dark rounded-card-inner p-4 border border-border-card flex flex-col items-center">
                    <img src={assetsConfig().app.logo} alt="Nomas Wallet" className="w-30 h-30" />
                    <NomasSpacer y={6} />
                    <NomasInput
                        isPassword
                        label="Password"
                        placeholder="Enter your password"
                        isRequired
                        value={formik.values.password}
                        onValueChange={formik.handleChange("password")}
                        onBlur={formik.handleBlur("password")}
                        isInvalid={!!(formik.errors.password && formik.touched.password)}
                        errorMessage={formik.errors.password}
                        warningClassName="text-center"
                    />
                </div>
            </NomasCardBody>
            <NomasCardFooter>
                <div className="w-full">
                    <NomasButton 
                        xlSize
                        className="w-full"
                        isLoading={formik.isSubmitting}
                        isDisabled={!formik.isValid}
                        onClick={async () => await formik.submitForm()}>
                    Continue
                    </NomasButton>
                    <NomasSpacer y={4} />
                    <div className="w-full">
                        <NomasLink underline={false} className="text-xs text-center">Forgot Password?</NomasLink>
                    </div>
                </div>
            </NomasCardFooter>
        </NomasCard>
    )
}
