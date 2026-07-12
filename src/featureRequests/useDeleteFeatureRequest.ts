import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFeatureRequest } from "./deleteFeatureRequest.ts";
import { featureRequestsQueryKey } from "./useFeatureRequests.ts";

export const useDeleteFeatureRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFeatureRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: featureRequestsQueryKey }),
  });
};
