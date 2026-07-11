import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

import type { FeatureRequestFormState } from "./useFeatureRequestForm.ts";

const FeatureRequestFields = ({ form }: { form: FeatureRequestFormState }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label htmlFor="feature-request-title">Title</Label>
      <Input
        id="feature-request-title"
        placeholder="What should we build?"
        value={form.title}
        onChange={(event) => form.setTitle(event.target.value)}
      />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="feature-request-description">Description</Label>
      <Textarea
        id="feature-request-description"
        placeholder="What's the idea, and why?"
        value={form.description}
        onChange={(event) => form.setDescription(event.target.value)}
      />
    </div>
  </div>
);

export default FeatureRequestFields;
