export const envConfig = () => {
    return {
        lifi: {
            integrator: import.meta.env.VITE_LIFI_INTEGRATOR,
            apiKey: import.meta.env.VITE_LIFI_API_KEY,
        },
    }
}