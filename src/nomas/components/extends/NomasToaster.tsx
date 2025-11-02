import { Toaster as Sonner, type ToasterProps } from "sonner"
const NomasToaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            position="bottom-center"
            duration={1000}
            expand={false}
            visibleToasts={1}
            className="![--width:200px]"
            toastOptions={{
                unstyled: true,
                className: "flex justify-center w-full p-2 gap-2 pointer-events-none items-center",
                classNames: {
                    // từng toast
                    toast: "!border-none bg-toast !text-text rounded-md shadow-md mx-auto",
                    // text
                    title: "!min-h-4 h-4 !text-xs text-center",
                },
            }}
            {...props}
        />
    )
}
export { NomasToaster }