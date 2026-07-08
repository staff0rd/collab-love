import { SignInWithApple } from "@capacitor-community/apple-sign-in";

import { supabase } from "../lib/supabaseClient.ts";

const HEX_RADIX = 16;
const HEX_PAD_WIDTH = 2;
const NONCE_BYTE_LENGTH = 16;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(HEX_RADIX).padStart(HEX_PAD_WIDTH, "0")).join("");

const randomNonce = () => toHex(crypto.getRandomValues(new Uint8Array(NONCE_BYTE_LENGTH)));

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(new Uint8Array(digest));
};

export const signInWithAppleNative = async () => {
  const rawNonce = randomNonce();
  const hashedNonce = await sha256(rawNonce);

  const { response } = await SignInWithApple.authorize({
    clientId: "love.collab.app",
    nonce: hashedNonce,
    redirectURI: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`,
    scopes: "email name",
  });

  const { error } = await supabase.auth.signInWithIdToken({
    nonce: rawNonce,
    provider: "apple",
    token: response.identityToken,
  });
  if (error) {
    throw error;
  }
};
