import { encodePacked, keccak256 } from 'https://esm.sh/viem'
import { privateKeyToAccount } from 'https://esm.sh/viem/accounts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { proof, userAddress } = await req.json();

    if (!proof || !userAddress) throw new Error("Missing params");

    const claimId = proof.identifier;
    
    const WITNESS_PK = Deno.env.get("WITNESS_PRIVATE_KEY");
    if (!WITNESS_PK) throw new Error("Witness key not set");
    
    const account = privateKeyToAccount(WITNESS_PK as `0x${string}`);

    const messageHash = keccak256(
      encodePacked(['address', 'bytes32'], [userAddress, claimId])
    );

    const signature = await account.signMessage({
      message: { raw: messageHash }
    });

    return new Response(
      JSON.stringify({ signature, claimId }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});