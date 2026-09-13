const tokensEndpoint = (householdId: string, actor: string | null): URL => {
  const endpoint = new URL(`${Deno.env.get("SUPABASE_URL")}/rest/v1/device_tokens`);
  endpoint.searchParams.set("select", "token");
  endpoint.searchParams.set("household_id", `eq.${householdId}`);
  if (actor !== null) {
    endpoint.searchParams.set("user_id", `neq.${actor}`);
  }
  return endpoint;
};

export const householdDeviceTokens = async (
  householdId: string,
  actor: string | null,
): Promise<string[]> => {
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const response = await fetch(tokensEndpoint(householdId, actor), {
    headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` },
  });
  if (!response.ok) {
    throw new Error(
      `Reading device_tokens failed with ${response.status}: ${await response.text()}`,
    );
  }
  const rows = (await response.json()) as { token: string }[];
  return rows.map((row) => row.token);
};
