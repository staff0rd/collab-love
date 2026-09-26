export const deleteDeviceTokens = async (tokens: string[]): Promise<void> => {
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const endpoint = new URL(`${Deno.env.get("SUPABASE_URL")}/rest/v1/device_tokens`);
  endpoint.searchParams.set("token", `in.(${tokens.join(",")})`);
  const response = await fetch(endpoint, {
    headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` },
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(
      `Deleting device_tokens failed with ${response.status}: ${await response.text()}`,
    );
  }
};
