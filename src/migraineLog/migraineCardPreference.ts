import { createObservableBooleanPreference } from "../lib/booleanPreference.ts";

const preference = createObservableBooleanPreference("migraine-card-enabled");

export const getMigraineCardEnabled = preference.get;
export const setMigraineCardEnabled = preference.set;
export const subscribeToMigraineCardPreference = preference.subscribe;
