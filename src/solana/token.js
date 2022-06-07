// import { Connection, .. } from "@solana/web3.js"

// import {} from "@solana/spl-token"


import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";


async function getTokenOwners(token_mint_address) {
  const MY_TOKEN_MINT_ADDRESS = "BUGuuhPsHpk8YZrL2GctsCtXGneL1gmT5zYb7eMHZDWf";
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const accounts = await connection.getProgramAccounts(
    TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      dataSlice: {
        offset: 0, // number of bytes
        length: 0, // number of bytes
      },
      filters: [
        {
          dataSize: 165, // number of bytes
        },
        {
          memcmp: {
            offset: 0, // number of bytes
            bytes: token_mint_address, // base58 encoded string
          },
        },
      ],
    }
  );
  console.log(
    `Found ${accounts.length} token account(s) for mint ${MY_TOKEN_MINT_ADDRESS}`
  );
  console.log(accounts);
}