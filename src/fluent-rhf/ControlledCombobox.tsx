import { FC } from "react";
import { Controller } from "react-hook-form";
import { ComboBox, IComboBoxProps } from "office-ui-fabric-react";
import * as React from "react";
import { HookFormProps } from "./HookFormProps";

export const ControlledCombobox: FC<HookFormProps & IComboBoxProps> = (
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
        <ComboBox
          {...props}
          selectedKey={value}
          onChange={(_, option) => {
            onChange(option.key);
          }}
          onBlur={onBlur}
          errorMessage={error && error.message}
          defaultValue={undefined}
        />
      )}
    />
  );
};
