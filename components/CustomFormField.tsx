import Image from "next/image";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  children?: React.ReactNode;
  readOnly?: boolean;
  className?: string;
  renderSkeleton?: (field: any) => React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    placeholder,
    name,
    onKeyDown,
    onChange,
    readOnly,
    className,
  } = props;
  let inputType = "text";
  if (name === "password") {
    inputType = "password";
  }

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="relative">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={20}
              width={20}
              alt={props.iconAlt || "icon"}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              type={inputType}
              readOnly={readOnly}
              className={`
                ${props.iconSrc ? "pl-10" : ""}
                ${
                  readOnly
                    ? "cursor-not-allowed bg-interaction-secondary-disable focus:border-interaction-outline-disable border-interaction-outline-disable text-dark-disable"
                    : ""
                }
              `}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e);
              }}
              onKeyDown={onKeyDown}
            />
          </FormControl>
        </div>
      );
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label, disabled } = props;
  return (
    <FormField
      disabled={disabled}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
