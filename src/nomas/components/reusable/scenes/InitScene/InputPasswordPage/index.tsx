import React from "react"
import { 
    NomasButton, 
    NomasCard, 
    NomasCardBody, 
    NomasCardFooter, 
    NomasCardHeader, 
    NomasCardVariant, 
    NomasInput,
    NomasLink
} from "../../../../extends"
import { useInputPasswordFormik } from "@/nomas/hooks"
import { NomasSpacer } from "../../../../extends"

export const InputPasswordPage = () => {
    const formik = useInputPasswordFormik()
    return (
        <NomasCard
            variant={NomasCardVariant.Gradient}
        >
            <NomasCardHeader title="Input Password" />
            <NomasCardBody className="flex flex-col items-center">
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
                />
                <NomasSpacer y={4} />
                <div className="w-full text-start">
                    <NomasLink className="text-xs text-start">Forgot Password?</NomasLink>
                </div>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton 
                    className="w-full"
                    isLoading={formik.isSubmitting}
                    isDisabled={!formik.isValid}
                    onClick={async () => await formik.submitForm()}>
                    Continue
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}
