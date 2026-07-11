import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";

import { type HouseholdMember, memberDisplayName } from "../household/getHousehold.ts";

import type { ScheduledItemFormState } from "./useScheduledItemForm.ts";

const variantFor = (selected: boolean): "default" | "outline" => {
  if (selected) {
    return "default";
  }
  return "outline";
};

type OwnerFieldProps = {
  form: ScheduledItemFormState;
  members: HouseholdMember[];
};

const OwnerField = ({ form, members }: OwnerFieldProps) => (
  <div className="flex flex-col gap-2">
    <Label>Owner</Label>
    <div className="grid grid-cols-2 gap-2">
      <Button
        type="button"
        variant={variantFor(form.ownerUserId === null)}
        className="w-full"
        onClick={() => form.setOwnerUserId(null)}
      >
        Both
      </Button>
      {members.map((member) => (
        <Button
          key={member.userId}
          type="button"
          variant={variantFor(form.ownerUserId === member.userId)}
          className="w-full"
          onClick={() => form.setOwnerUserId(member.userId)}
        >
          {memberDisplayName(member)}
        </Button>
      ))}
    </div>
  </div>
);

export default OwnerField;
