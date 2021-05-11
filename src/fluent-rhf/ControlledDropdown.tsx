import { FC } from "react";
import { Controller } from "react-hook-form";
import { Dropdown, IDropdownProps } from "office-ui-fabric-react";
import * as React from "react";
import { HookFormProps } from "./HookFormProps";

export const ControlledDropdown: FC<HookFormProps & IDropdownProps> = (
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
        <Dropdown
          {...props}
          selectedKey={value}
          onChange={(_e, option) => {
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
