import type { FormEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button.tsx";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";

type FormSheetProps = {
  isOpen: boolean;
  title: string;
  description: string;
  error: string | null;
  canSave: boolean;
  onSave: () => void;
  onClose: () => void;
  children: ReactNode;
};

const FormSheet = ({
  isOpen,
  title,
  description,
  error,
  canSave,
  onSave,
  onClose,
  children,
}: FormSheetProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <SheetBody className="flex flex-col gap-4">
            {children}

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </SheetBody>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSave}>
              Save
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default FormSheet;
