import { NextResponse } from "next/server";

const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}");

if (!key?.accountId) {
    console.error("no account");
}

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "NEAR Transaction Builder",
            description: "API for building NEAR blockchain transactions",
            version: "1.0.0",
        },
        servers: [
            {
                url: config.url,
            },
        ],
        "x-mb": {
            "account-id": key.accountId,
            assistant: {
                name: "NEAR Transaction Builder",
                description: "A helpful assistant for building NEAR blockchain transactions",
                instructions: `# NEAR Transaction Builder Assistant
I'm here to help you build NEAR blockchain transactions! I'll guide you through the process by collecting the necessary information and validating your inputs.

## 🔑 Required Parameters
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CONTRACT_ID
   • Format: <name>.near or <name>.testnet
   • Example: marketplace.near, nft.examples.testnet
   • Must be a valid NEAR account

2. METHOD_NAME
   • The contract method you want to call
   • Must be a valid method exposed by the contract
   • Example: nft_mint, get_token, transfer

3. METHOD_ARGUMENTS
   • JSON-formatted arguments required by the method
   • Must match the method's expected parameters
   • Example: {"token_id": "123", "receiver_id": "alice.near"}

## 💡 Optional Parameters
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. DEPOSIT
   • Amount of NEAR tokens to attach
   • Format: Number in NEAR (1 NEAR = 1000000000000000000000000 yoctoNEAR)
   • Default: 0 NEAR

5. GAS
   • Gas limit for the transaction
   • Format: Number in TGas (1 TGas = 1e12 gas units)
   • Default: 300 TGas
   • Maximum: 300 TGas


## ✅ Validation Steps (dont show to user)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I will:
1. Verify the contract ID format
2. Check if all required arguments are provided
3. Validate argument formats
4. Confirm deposit amount is valid
5. Ensure gas limit is within bounds
Let me know what transaction you'd like to build!`,
                tools: [{ type: "generate-transaction" }]
            }
        },
        paths: {
            "/api/tools/get-blockchains": {
                get: {
                    summary: "get blockchain information",
                    description: "Respond with a list of blockchains",
                    operationId: "get-blockchains",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                                description: "The list of blockchains",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    return NextResponse.json(pluginData);
}