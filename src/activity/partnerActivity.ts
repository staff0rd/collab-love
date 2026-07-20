import type { FeatureRequest } from "../featureRequests/getFeatureRequests.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

const MAX_ENTRIES = 50;
const SLICE_START = 0;

type ActivityKind = "added" | "changed";

type ActivitySource = "scheduledItem" | "featureRequest";

export type ActivityEntry = {
  key: string;
  itemId: string;
  source: ActivitySource;
  title: string;
  kind: ActivityKind;
  at: string;
};

type ActivityInput = {
  itemId: string;
  source: ActivitySource;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
};

const wasEdited = (createdAt: string, updatedAt: string): boolean =>
  new Date(updatedAt).getTime() > new Date(createdAt).getTime();

const entryFor = (input: ActivityInput, partnerUserId: string): ActivityEntry | null => {
  const base = {
    itemId: input.itemId,
    key: `${input.source}:${input.itemId}`,
    source: input.source,
  };
  if (input.updatedBy === partnerUserId && wasEdited(input.createdAt, input.updatedAt)) {
    return { ...base, at: input.updatedAt, kind: "changed", title: input.title };
  }
  if (input.createdBy === partnerUserId) {
    return { ...base, at: input.createdAt, kind: "added", title: input.title };
  }
  return null;
};

const scheduledItemInput = (item: ScheduledItem): ActivityInput => ({
  createdAt: item.createdAt,
  createdBy: item.createdBy,
  itemId: item.id,
  source: "scheduledItem",
  title: item.title,
  updatedAt: item.updatedAt,
  updatedBy: item.updatedBy,
});

const featureRequestInput = (item: FeatureRequest): ActivityInput => ({
  createdAt: item.createdAt,
  createdBy: item.createdBy,
  itemId: item.id,
  source: "featureRequest",
  title: item.title,
  updatedAt: item.updatedAt,
  updatedBy: item.updatedBy,
});

export const partnerActivity = (
  scheduledItems: ScheduledItem[],
  featureRequests: FeatureRequest[],
  partnerUserId: string,
): ActivityEntry[] => {
  const inputs = [
    ...scheduledItems.map(scheduledItemInput),
    ...featureRequests.map(featureRequestInput),
  ];
  return inputs
    .map((input) => entryFor(input, partnerUserId))
    .filter((entry): entry is ActivityEntry => entry !== null)
    .sort((left, right) => new Date(right.at).getTime() - new Date(left.at).getTime())
    .slice(SLICE_START, MAX_ENTRIES);
};
