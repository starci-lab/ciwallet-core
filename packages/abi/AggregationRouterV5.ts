export const AggregationRouterV5Abi = [
    {
        "inputs": [
            {
                "internalType": "contract IWETH10",
                "name": "weth",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "ffFactory",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "poolInitCodeHash",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "BadPool",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ETHTransferFailed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EmptyPools",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EthDepositRejected",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidMsgValue",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidShortString",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReservesCallFailed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReturnAmountIsNotEnough",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "value",
                "type": "int256"
            }
        ],
        "name": "SafeCastOverflowedIntToUint",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "SafeCastOverflowedUintToInt",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "SafeTransferFromFailed",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "str",
                "type": "string"
            }
        ],
        "name": "StringTooLong",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "SwapAmountTooLarge",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroMinReturn",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroReturnAmount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "EIP712DomainChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "destroy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eip712Domain",
        "outputs": [
            {
                "internalType": "bytes1",
                "name": "fields",
                "type": "bytes1"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "version",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "verifyingContract",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "salt",
                "type": "bytes32"
            },
            {
                "internalType": "uint256[]",
                "name": "extensions",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "rescueFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IAggregationExecutor",
                "name": "executor",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "contract IERC20",
                        "name": "srcToken",
                        "type": "address"
                    },
                    {
                        "internalType": "contract IERC20",
                        "name": "dstToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "srcReceiver",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "dstReceiver",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minReturnAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "flags",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct GenericRouter.SwapDescription",
                "name": "desc",
                "type": "tuple"
            },
            {
                "internalType": "bytes",
                "name": "permit",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "swap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "spentAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minReturn",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "pools",
                "type": "uint256[]"
            }
        ],
        "name": "uniswapV3Swap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "amount0Delta",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "amount1Delta",
                "type": "int256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "uniswapV3SwapCallback",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minReturn",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "pools",
                "type": "uint256[]"
            }
        ],
        "name": "uniswapV3SwapTo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "contract IERC20",
                "name": "srcToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minReturn",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "pools",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes",
                "name": "permit",
                "type": "bytes"
            }
        ],
        "name": "uniswapV3SwapToWithPermit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "srcToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minReturn",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "pools",
                "type": "uint256[]"
            }
        ],
        "name": "unoswap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "contract IERC20",
                "name": "srcToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minReturn",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "pools",
                "type": "uint256[]"
            }
        ],
        "name": "unoswapTo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "contract IERC20",
                "name": "srcToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minReturn",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "pools",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes",
                "name": "permit",
                "type": "bytes"
            }
        ],
        "name": "unoswapToWithPermit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
] as const