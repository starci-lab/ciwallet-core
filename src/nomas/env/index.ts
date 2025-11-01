export const envConfig = () => {
    return {
        lifi: {
            integrator: import.meta.env.VITE_LIFI_INTEGRATOR,
            apiKey: import.meta.env.VITE_LIFI_API_KEY,
        },
        colyseus: {
            endpoint:
        import.meta.env.VITE_COLYSEUS_URL ||
        "https://nomas-colyseus.kanibot.xyz",
        },
    }
}
