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
        nomasServer: {
            endpoint:
        import.meta.env.VITE_SERVER_URL || "https://nomas-server.kanibot.xyz",
            maxRetry: Number(import.meta.env.VITE_NOMAS_SERVER_MAX_RETRY || 3),
            maxRetryDelay: Number(
                import.meta.env.VITE_NOMAS_SERVER_MAX_RETRY_DELAY || 1000
            ),
            initialRetryDelay: Number(
                import.meta.env.VITE_NOMAS_SERVER_INITIAL_RETRY_DELAY || 300
            ),
            timeout: Number(import.meta.env.VITE_NOMAS_SERVER_TIMEOUT || 300000),
        },
    }
}
