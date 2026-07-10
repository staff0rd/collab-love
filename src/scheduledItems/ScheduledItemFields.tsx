import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

import DateTimePicker from "./DateTimePicker.tsx";
import type { ScheduledItemFormState } from "./useScheduledItemForm.ts";

const ScheduledItemFields = ({ form }: { form: ScheduledItemFormState }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label htmlFor="scheduled-item-title">Title</Label>
      <Input
        id="scheduled-item-title"
        placeholder="What's happening?"
        value={form.title}
        onChange={(event) => form.setTitle(event.target.value)}
      />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="scheduled-item-datetime">Date &amp; time</Label>
      <DateTimePicker
        id="scheduled-item-datetime"
        value={form.scheduledAt}
        onChange={form.setScheduledAt}
      />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="scheduled-item-owner">Owner</Label>
      <Input
        id="scheduled-item-owner"
        placeholder="Who's responsible?"
        value={form.owner}
        onChange={(event) => form.setOwner(event.target.value)}
      />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="scheduled-item-notes">Notes</Label>
      <Textarea
        id="scheduled-item-notes"
        placeholder="Anything to remember?"
        value={form.notes}
        onChange={(event) => form.setNotes(event.target.value)}
      />
    </div>
  </div>
);

export default ScheduledItemFields;
