import React from "react"
import { NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasInput } from "../../../../extends"
import { useCreatePasswordFormik } from "@/nomas/hooks"

export const CreatePasswordPage = () => {
    const formik = useCreatePasswordFormik()
    return (
        <NomasCard
            asCore
        >
            <NomasCardHeader title="Create Password" />
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
                <NomasInput
                    label="Confirm Password"
                    placeholder="Enter your password again"
                    type="password"
                    isRequired
                    value={formik.values.confirmPassword}
                    onValueChange={formik.handleChange("confirmPassword")}
                    onBlur={formik.handleBlur("confirmPassword")}
                    isInvalid={!!(formik.errors.confirmPassword && formik.touched.confirmPassword)}
                    errorMessage={formik.errors.confirmPassword}
                />
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton 
                    asBase 
                    isLoading={formik.isSubmitting}
                    isDisabled={!formik.isValid}
                    onPress={() => formik.submitForm()}>
                    Create Password
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}
