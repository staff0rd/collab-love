import type { FeatureRequest } from "../featureRequests/getFeatureRequests.ts";
import type { LastAction, ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { nextOccurrence } from "../scheduledItems/nextOccurrence.ts";

const MAX_ENTRIES = 50;
const SLICE_START = 0;

type ActivityKind = "added" | "changed" | "bumped";

type ActivitySource = "scheduledItem" | "featureRequest";

export type ActivityEntry = {
  key: string;
  itemId: string;
  source: ActivitySource;
  title: string;
  kind: ActivityKind;
  at: string;
  occurrenceAt: string | null;
};

type ActivityInput = {
  itemId: string;
  source: ActivitySource;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  lastAction: LastAction | null;
  occurrenceAt: string | null;
};

const wasEdited = (createdAt: string, updatedAt: string): boolean =>
  new Date(updatedAt).getTime() > new Date(createdAt).getTime();

const changeKind = (lastAction: LastAction | null): ActivityKind => {
  if (lastAction === "bumped") {
    return "bumped";
  }
  return "changed";
};

const entryFor = (input: ActivityInput, partnerUserId: string): ActivityEntry | null => {
  const base = {
    itemId: input.itemId,
    key: `${input.source}:${input.itemId}`,
    source: input.source,
    title: input.title,
  };
  if (input.updatedBy === partnerUserId && wasEdited(input.createdAt, input.updatedAt)) {
    return {
      ...base,
      at: input.updatedAt,
      kind: changeKind(input.lastAction),
      occurrenceAt: input.occurrenceAt,
    };
  }
  if (input.createdBy === partnerUserId) {
    return { ...base, at: input.createdAt, kind: "added", occurrenceAt: null };
  }
  return null;
};

const scheduledItemInput = (item: ScheduledItem, now: Date): ActivityInput => ({
  createdAt: item.createdAt,
  createdBy: item.createdBy,
  itemId: item.id,
  lastAction: item.lastAction,
  occurrenceAt: nextOccurrence(item, now).toISOString(),
  source: "scheduledItem",
  title: item.title,
  updatedAt: item.updatedAt,
  updatedBy: item.updatedBy,
});

const featureRequestInput = (item: FeatureRequest): ActivityInput => ({
  createdAt: item.createdAt,
  createdBy: item.createdBy,
  itemId: item.id,
  lastAction: null,
  occurrenceAt: null,
  source: "featureRequest",
  title: item.title,
  updatedAt: item.updatedAt,
  updatedBy: item.updatedBy,
});

type PartnerActivityInputs = {
  scheduledItems: ScheduledItem[];
  featureRequests: FeatureRequest[];
  partnerUserId: string;
  now: Date;
};

export const partnerActivity = ({
  scheduledItems,
  featureRequests,
  partnerUserId,
  now,
}: PartnerActivityInputs): ActivityEntry[] => {
  const inputs = [
    ...scheduledItems.map((item) => scheduledItemInput(item, now)),
    ...featureRequests.map(featureRequestInput),
  ];
  return inputs
    .map((input) => entryFor(input, partnerUserId))
    .filter((entry): entry is ActivityEntry => entry !== null)
    .sort((left, right) => new Date(right.at).getTime() - new Date(left.at).getTime())
    .slice(SLICE_START, MAX_ENTRIES);
};
