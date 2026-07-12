import { useMutation, useQueryClient } from "@tanstack/react-query";

import { NEXT_FEATURE_REQUEST_STATUS } from "./featureRequestStatus.ts";
import type { FeatureRequest } from "./getFeatureRequests.ts";
import { updateFeatureRequest } from "./updateFeatureRequest.ts";
import { featureRequestsQueryKey } from "./useFeatureRequests.ts";

export const useAdvanceFeatureRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: FeatureRequest) => {
      const next = NEXT_FEATURE_REQUEST_STATUS[item.status];
      if (!next) {
        return;
      }
      await updateFeatureRequest(item.id, { status: next });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: featureRequestsQueryKey }),
  });
};
