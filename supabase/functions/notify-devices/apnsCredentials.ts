export type ApnsCredentials = {
  keyId: string;
  teamId: string;
  privateKey: string;
};

const required = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`${name} is not set in the function secrets`);
  }
  return value;
};

export const apnsCredentials = (): ApnsCredentials => ({
  keyId: required("APNS_KEY_ID"),
  privateKey: required("APNS_PRIVATE_KEY").replaceAll("\\n", "\n"),
  teamId: required("APNS_TEAM_ID"),
});
