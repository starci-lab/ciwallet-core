import React from "react"
import { 
    NomasButton, 
    NomasCard, 
    NomasCardBody, 
    NomasCardFooter, 
    NomasCardHeader, 
    NomasCardVariant, 
    NomasInput,
    NomasSpacer,
    NomasWarningText
} from "../../../../extends"
import { PasswordStrength, useCreatePasswordFormik } from "@/nomas/hooks"
import { useAppDispatch, setInitPage, InitPage } from "@/nomas/redux"

export const CreatePasswordPage = () => {
    const formik = useCreatePasswordFormik()
    const dispatch = useAppDispatch()
    const renderStrength = () => {
        switch (formik.values.passwordStrength) {
        case PasswordStrength.Weak:
            return <div className="text-danger text-xs">Weak</div>
        case PasswordStrength.Medium:
            return <div className="text-warning text-xs">Medium</div>
        case PasswordStrength.Strong:
            return <div className="text-success text-xs">Strong</div>
        case PasswordStrength.VeryStrong:
            return <div className="text-success text-xs">Very Strong</div>
        }
    }
    return (
        <NomasCard
            variant={NomasCardVariant.Gradient}
        >
            <NomasCardHeader showBackButton onBackButtonPress={() => dispatch(setInitPage(InitPage.Launch))} title="Create Password" />
            <NomasCardBody className="flex flex-col items-center">
                <NomasInput
                    isPassword
                    label="Password"
                    placeholder="Enter your password"
                    isRequired
                    value={formik.values.password}
                    onValueChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                />
                <NomasSpacer y={4} />
                <NomasInput
                    label="Confirm Password"
                    placeholder="Enter your password again"
                    isPassword
                    isRequired
                    value={formik.values.confirmPassword}
                    onValueChange={formik.handleChange("confirmPassword")}
                    onBlur={formik.handleBlur("confirmPassword")}
                />
                <NomasSpacer y={4} />
                <div className="w-full text-start">
                    {
                        formik.values.confirmPassword && formik.errors.confirmPassword ? (
                            <NomasWarningText>{formik.errors.confirmPassword}</NomasWarningText>
                        ) : (
                            <div className="w-full text-start flex items-center gap-1">
                                <div className="text-xs text-muted font-bold">Password Strength:</div>
                                {renderStrength()}
                            </div>
                        )
                    }
                </div>   
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton 
                    className="w-full" 
                    isLoading={formik.isSubmitting}
                    isDisabled={!formik.isValid}
                    onClick={async () => await formik.submitForm()}>
                    Create Password
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}
