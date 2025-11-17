export const TESTNET_GUARDIAN_NODES = [
    {
        nodeId: "node-1",
        publicKey:
        "04bab844e8620c4a1ec304df6284cd6fdffcde79b3330a7bffb1e4cecfee72d02a7c1f3a4415b253dc8d6ca2146db170e1617605cc8a4160f539890b8a24712152",
    },
    {
        nodeId: "hl-node-testnet",
        publicKey:
        "04502d20a0d8d8aaea9395eb46d50ad2d8278c1b3a3bcdc200d531253612be23f5f2e9709bf3a3a50d1447281fa81aca0bf2ac2a6a3cb8a12978381d73c24bb2d9",
    },
    {
        nodeId: "field-node",
        publicKey:
        "04e674a796ff01d6b74f4ee4079640729797538cdb4926ec333ce1bd18414ef7f22c1a142fd76dca120614045273f30338cd07d79bc99872c76151756aaec0f8e8",
    },
]
  
export const MAINNET_GUARDIAN_NODES = [
    {
        nodeId: "unit-node",
        publicKey:
        "04dc6f89f921dc816aa69b687be1fcc3cc1d48912629abc2c9964e807422e1047e0435cb5ba0fa53cb9a57a9c610b4e872a0a2caedda78c4f85ebafcca93524061",
    },
    {
        nodeId: "hl-node",
        publicKey:
        "048633ea6ab7e40cdacf37d1340057e84bb9810de0687af78d031e9b07b65ad4ab379180ab55075f5c2ebb96dab30d2c2fab49d5635845327b6a3c27d20ba4755b",
    },
    {
        nodeId: "field-node",
        publicKey:
        "04ae2ab20787f816ea5d13f36c4c4f7e196e29e867086f3ce818abb73077a237f841b33ada5be71b83f4af29f333dedc5411ca4016bd52ab657db2896ef374ce99",
    },
]
  
const GUARDIAN_SIGNATURE_THRESHOLD = 2
  
// --- Types ---
export interface Proposal {
    destinationAddress: string;
    destinationChain: string;
    asset: string;
    address: string;
    sourceChain: string;
    coinType?: string;
    keyType?: string;
  }
  
export interface VerificationResult {
    success: boolean;
    verifiedCount: number;
    errors?: string[];
    verificationDetails?: { [nodeId: string]: boolean };
  }
  
// --- Helpers ---
const hexToBytes = (hex: string): Uint8Array => {
    const clean = hex.startsWith("0x") ? hex.slice(2) : hex
    return new Uint8Array(Buffer.from(clean, "hex"))
}
  
const legacyProposalToPayload = (nodeId: string, proposal: Proposal): Uint8Array => {
    const payload = `${nodeId}:${[
        proposal.destinationAddress,
        proposal.destinationChain,
        proposal.asset,
        proposal.address,
        proposal.sourceChain,
        "deposit",
    ].join("-")}`
    return new TextEncoder().encode(payload)
}
  
const newProposalToPayload = (nodeId: string, proposal: Proposal): Uint8Array => {
    const payload = `${nodeId}:${[
        "user",
        proposal.coinType,
        proposal.destinationChain,
        proposal.destinationAddress,
        proposal.address,
    ].join("-")}`
    return new TextEncoder().encode(payload)
}
  
const proposalToPayload = (nodeId: string, proposal: Proposal): Uint8Array => {
    return proposal.coinType === "ethereum"
        ? newProposalToPayload(nodeId, proposal)
        : legacyProposalToPayload(nodeId, proposal)
}
  
const processGuardianNodes = async (nodes: { nodeId: string; publicKey: string }[]) => {
    const processed = []
    for (const node of nodes) {
        const keyBytes = hexToBytes(node.publicKey)
        if (keyBytes.length !== 65 || keyBytes[0] !== 0x04) {
            throw new Error(`Invalid public key for ${node.nodeId}`)
        }
        const key = await crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "ECDSA", namedCurve: "P-256" },
            true,
            ["verify"]
        )
        processed.push({ nodeId: node.nodeId, publicKey: key })
    }
    return processed
}
  
const verifySignature = async (
    publicKey: CryptoKey,
    message: Uint8Array,
    signature: string
): Promise<boolean> => {
    try {
        const bytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0))
        if (bytes.length !== 64) return false
        return await crypto.subtle.verify(
            { name: "ECDSA", hash: { name: "SHA-256" } },
            publicKey,
            bytes,
            message
        )
    } catch {
        return false
    }
}
  
// --- Main entry ---
export const verifyDepositAddressSignatures = async (
    signatures: { [nodeId: string]: string },
    proposal: Proposal,
    nodes: { nodeId: string; publicKey: string }[]
): Promise<VerificationResult> => {
    const processed = await processGuardianNodes(nodes)
    let verifiedCount = 0
    const details: Record<string, boolean> = {}
    const errors: string[] = []
  
    await Promise.all(
        processed.map(async ({ nodeId, publicKey }) => {
            const sig = signatures[nodeId]
            if (!sig) {
                details[nodeId] = false
                return
            }
            try {
                let ok = await verifySignature(publicKey, proposalToPayload(nodeId, proposal), sig)
                // fallback check for both payload versions
                if (!ok && proposal.coinType !== "ethereum") {
                    ok = await verifySignature(publicKey, newProposalToPayload(nodeId, proposal), sig)
                }
                details[nodeId] = ok
                if (ok) verifiedCount++
            } catch (err) {
                errors.push(`Node ${nodeId} error: ${(err as Error).message}`)
                details[nodeId] = false
            }
        })
    )
  
    return {
        success: verifiedCount >= GUARDIAN_SIGNATURE_THRESHOLD,
        verifiedCount,
        verificationDetails: details,
        errors: errors.length ? errors : undefined,
    }
}