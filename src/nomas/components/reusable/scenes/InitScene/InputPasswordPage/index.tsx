import React from "react"
import { 
    NomasButton, 
    NomasCard, 
    NomasCardBody, 
    NomasCardFooter, 
    NomasCardHeader, 
    NomasInput
} from "../../../../extends"
import { useInputPasswordFormik } from "@/nomas/hooks"

export const InputPasswordPage = () => {
    const formik = useInputPasswordFormik()
    return (
        <NomasCard
            asCore
        >
            <NomasCardHeader title="Input Password" />
            <NomasCardBody className="flex flex-col items-center gap-8">
                <NomasInput
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    isRequired
                    value={formik.values.password}
                    onValueChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    isInvalid={!!(formik.errors.password && formik.touched.password)}
                    errorMessage={formik.errors.password}
                />
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton 
                    asBase 
                    isLoading={formik.isSubmitting}
                    isDisabled={!formik.isValid}
                    onPress={() => formik.submitForm()}>
                    Continue
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}
