import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useController, type Control } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  placeHolder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  type?: "text" | "number" | "select" | "textarea";
  options?: Array<{
    id: number;
    name?: string;
    name_ar?: string;
    name_en?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Function?: (value: any) => void;
  disabled?: boolean;
}

export function FormField({
  name,
  label,
  placeHolder,
  control,
  type = "select",
  options,
  Function,
  disabled = false,
}: FormFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        {type === "select" ? (
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              Function?.(value);
            }}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder={placeHolder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={option.id}
                  value={
                    option?.value
                      ? option?.name_en ?? ""
                      : option?.name
                      ? option?.name
                      : option?.id.toString()
                  }
                >
                  {option.name_ar ? option.name_ar : option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === "textarea" ? (
          <Textarea
            placeholder={placeHolder}
            {...field}
            className="resize-none h-32"
            disabled={disabled}
          />
        ) : (
          <Input
            className="h-12"
            type={type}
            placeholder={placeHolder}
            {...field}
            disabled={disabled}
          />
        )}
      </FormControl>
      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  );
}
