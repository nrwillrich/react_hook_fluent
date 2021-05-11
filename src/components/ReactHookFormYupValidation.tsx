import {
  IComboBoxOption,
  PrimaryButton,
  Spinner
} from "office-ui-fabric-react";
import * as React from "react";
import { FC, useRef, useState } from "react";
import { DeepMap, FieldError, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SchemaOf } from "yup";
import { ControlledTextField } from "../fluent-rhf/ControlledTextField";
import { nameof, sleep } from "../utils";

import { ControlledDatePicker } from "../fluent-rhf/ControlledDatePicker";
import { ControlledCombobox } from "../fluent-rhf/ControlledCombobox";
import { ControlledDropdown } from "../fluent-rhf/ControlledDropdown";
import { ControlledTextFieldAsync } from "../fluent-rhf/ControlledTextFieldAsync";

type Form = {
  name: string;
  email: string;
  minMaxNumber: number;
  asyncValidate: string;
  multiCustomValidation: string;
  datePicker: Date;
  minDate: Date;
  combobox: string;
  dropdown: string;
};

type ValidationContext = {
  shouldValidate: () => boolean;
};

export const ReactHookFormYupValidation: FC = () => {
  const [validating, setValidating] = useState(false);
  const [validFormData, setValidFormData] = useState<Form>();
  const [validationError, setValidationError] = useState<
    DeepMap<Form, FieldError>
  >();
  const shouldValidate = useRef(false);

  const comboboxItems: IComboBoxOption[] = [
    { key: "A", text: "Option A" },
    { key: "B", text: "Option B" },
    { key: "C", text: "Option C" },
    { key: "D", text: "Option D" }
  ];

  const schema: SchemaOf<Form> = yup.object().shape({
    name: yup.string().required("This is required field"),
    email: yup
      .string()
      .required("This is required field")
      .email("This is not a valid email address"),
    minMaxNumber: yup
      .number()
      .nullable()
      .min(0, "Minimum value is 0")
      .max(10, "Maximum value is 10"),
    asyncValidate: yup
      .string()
      .test(
        nameof<Form>("asyncValidate"),
        "type 'spfx' to pass the validation",
        async (value, data) => {
          const context: ValidationContext = data.options.context as any;
          if (context.shouldValidate()) {
            setValidating(true);
            await sleep(500);
            setValidating(false);
            return value === "spfx";
          }
        }
      ),
    multiCustomValidation: yup
      .string()
      .test("notOne", "'1' is not a valid value here", (value) => value !== "1")
      .test(
        "notZero",
        "'0' is not a valid value here",
        (value) => value !== "0"
      ),
    datePicker: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .required("Date is required") as any,
    minDate: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .required("Date is required")
      .min(new Date(), "The date should be greater than today") as any,
    combobox: yup.string().required(),
    dropdown: yup.string().required()
  });

  const { handleSubmit, control, setValue } = useForm<Form, any>({
    defaultValues: {
      name: "",
      minMaxNumber: null
    },
    resolver: yupResolver(schema),
    mode: "all",
    context: {
      shouldValidate: () => shouldValidate.current
    } as ValidationContext
  });

  const onSave = async () => {
    setValidationError(null);
    setValidFormData(null);

    shouldValidate.current = true;
    try {
      await handleSubmit(
        (data) => {
          console.log(data);
          setValidFormData(data);
        },
        (err) => {
          console.log(err);
          setValidationError(err);
        }
      )();
    } finally {
      shouldValidate.current = false;
    }
  };

  return (
    <div>
      <div style={{ margin: "10px" }}>
        <h3>
          This sample uses Yup schema validation together with react-hook-form
        </h3>
        <ControlledTextField
          required={true}
          label="This is required field"
          control={control}
          name={nameof<Form>("name")}
        />

        <ControlledTextField
          required={true}
          label="This field is required and accepts only emails"
          control={control}
          name={nameof<Form>("email")}
        />

        <ControlledTextField
          label="This field accepts only numbers between 0-10"
          control={control}
          name={nameof<Form>("minMaxNumber")}
          type="number"
        />

        <div>
          <ControlledTextFieldAsync
            label="Async validation, pases validation if value is 'spfx'. Validates only on button click"
            control={control}
            setValue={setValue}
            name={nameof<Form>("asyncValidate")}
          />
          {validating && (
            <Spinner
              label="Validating..."
              styles={{
                root: {
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  flexDirection: "row"
                },
                label: {
                  marginLeft: "5px"
                }
              }}
            />
          )}
        </div>

        <ControlledTextField
          label="This field uses different validation rules - '1' and '0' are not accepted in this input"
          control={control}
          name={nameof<Form>("multiCustomValidation")}
        />

        <ControlledDatePicker
          isRequired={true}
          label="This is a required date picker"
          control={control}
          name={nameof<Form>("datePicker")}
        />

        <ControlledDatePicker
          isRequired={true}
          minDate={new Date()}
          label="This date picker requires a min date to be greater than today"
          control={control}
          name={nameof<Form>("minDate")}
        />

        <ControlledCombobox
          required={true}
          options={comboboxItems}
          label="This is a required combobox"
          control={control}
          name={nameof<Form>("combobox")}
          placeholder="Select a value"
        />

        <ControlledDropdown
          required={true}
          options={comboboxItems}
          label="This is a required dropdown"
          control={control}
          name={nameof<Form>("dropdown")}
          placeholder="Select a value"
        />

        <div style={{ padding: "10px 0", textAlign: "center" }}>
          <PrimaryButton onClick={onSave} text="Save" />
        </div>

        {validationError && (
          <>
            <div>Form validation errors:</div>
            <div>
              <pre>{JSON.stringify(validationError, null, 2)}</pre>
            </div>
          </>
        )}
        {validFormData && (
          <>
            <div>Form passed all validations</div>
            <div>
              <pre>{JSON.stringify(validFormData, null, 2)}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
