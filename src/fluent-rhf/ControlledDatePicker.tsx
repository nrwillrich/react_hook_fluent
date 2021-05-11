import { FC } from "react";
import { Controller } from "react-hook-form";
import { DatePicker, IDatePickerProps } from "office-ui-fabric-react";
import * as React from "react";
import { HookFormProps } from "./HookFormProps";

export const ControlledDatePicker: FC<HookFormProps & IDatePickerProps> = (
  props
) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || ""}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => (
        <DatePicker
          {...props}
          textField={{
            name: fieldName,
            //onChange,
            //onBlur,
            errorMessage: error && error.message
          }}
          onSelectDate={(date) => {
            onChange(date);
          }}
          value={value}
          onBlur={onBlur}
          defaultValue={undefined}
        />
      )}
    />
  );
};
