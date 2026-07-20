import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

import type { HouseholdMember } from "../household/getHousehold.ts";

import DateTimePicker from "./DateTimePicker.tsx";
import OwnerField from "./OwnerField.tsx";
import RecurrenceField from "./RecurrenceField.tsx";
import ReminderField from "./ReminderField.tsx";
import type { ScheduledItemFormState } from "./useScheduledItemForm.ts";

type ScheduledItemFieldsProps = {
  form: ScheduledItemFormState;
  members: HouseholdMember[];
};

const ScheduledItemFields = ({ form, members }: ScheduledItemFieldsProps) => (
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

    <RecurrenceField form={form} />

    <ReminderField form={form} />

    <OwnerField form={form} members={members} />

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
