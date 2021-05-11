import { Control, RegisterOptions, UseFormSetValue } from "react-hook-form";

export interface HookFormProps {
  control: Control<any>;
  name: string;
  rules?: RegisterOptions;
  defaultValue?: any;
  setValue?: UseFormSetValue<any>;
}
