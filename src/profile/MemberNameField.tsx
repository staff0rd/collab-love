import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

const labelFor = (isSelf: boolean): string => {
  if (isSelf) {
    return "Your name";
  }
  return "Your partner's name";
};

const placeholderFor = (isSelf: boolean): string => {
  if (isSelf) {
    return "What should you be called?";
  }
  return "What do you call them?";
};

type MemberNameFieldProps = {
  id: string;
  isSelf: boolean;
  value: string;
  onChange: (value: string) => void;
};

const MemberNameField = ({ id, isSelf, value, onChange }: MemberNameFieldProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>{labelFor(isSelf)}</Label>
    <Input
      id={id}
      placeholder={placeholderFor(isSelf)}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

export default MemberNameField;
