import * as React from "react";
import {
  IComboBoxOption,
  PrimaryButton,
  Spinner
} from "office-ui-fabric-react";
import { FC, useState } from "react";
import { DeepMap, FieldError, useForm } from "react-hook-form";
import { ControlledTextField } from "../fluent-rhf/ControlledTextField";
import { ControlledDatePicker } from "../fluent-rhf/ControlledDatePicker";
import { ControlledCombobox } from "../fluent-rhf/ControlledCombobox";
import { ControlledDropdown } from "../fluent-rhf/ControlledDropdown";
import { nameof, sleep } from "../utils";
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

// fields - required checkbox, combobox, dropdown, textfield, datetimepicker
// validation - required, pattern, min-max-length, async validate, validate function and object
export const ReactHookFormValidation: FC = () => {
  const [validating, setValidating] = useState(false);
  const [validFormData, setValidFormData] = useState<Form>();
  const [validationError, setValidationError] = useState<
    DeepMap<Form, FieldError>
  >();

  const comboboxItems: IComboBoxOption[] = [
    { key: "A", text: "Pessoa física" },
    { key: "B", text: "Pessoa física estrangeiro" },
    { key: "C", text: "MEI" },
    { key: "D", text: "Simples nacional" },
    { key: "E", text: "Lucro real" },
    { key: "F", text: "Lucro presumido" },
    { key: "G", text: "Lucro arbitrado" }
  ];

  const { handleSubmit, control, setValue, getValues } = useForm<Form, any>({
    defaultValues: {
      name: "",
      email: "",
      datePicker: null
    },
    reValidateMode: "onChange",
    mode: "all"
  });

  const onSave = () => {
    setValidationError(null);
    setValidFormData(null);

    handleSubmit(
      (data) => {
        console.log(data);
        setValidFormData(data);
      },
      (err) => {
        console.log(err);
        setValidationError(err);
      }
    )();
  };

  function vercpf(cpf) {
    if (
      cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    )
      return false;

    let add = 0;
    let i = 0;
    let rev = 0;

    for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);

    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;

    add = 0;
    for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;

    return true;
  }

  function verCNPJ(cnpj: string) {
    cnpj = cnpj.replace(/[^\d]+/g, "");

    if (cnpj === "") return false;

    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj === "00000000000000" ||
      cnpj === "11111111111111" ||
      cnpj === "22222222222222" ||
      cnpj === "33333333333333" ||
      cnpj === "44444444444444" ||
      cnpj === "55555555555555" ||
      cnpj === "66666666666666" ||
      cnpj === "77777777777777" ||
      cnpj === "88888888888888" ||
      cnpj === "99999999999999"
    )
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma: number = 0;
    let pos = tamanho - 7;
    let i = 0;

    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
  }

  return (
    <div>
      <div style={{ margin: "10px" }}>
        <h3>This sample uses native react-hook-form rules</h3>
        <ControlledTextField
          required={true}
          label="Documento"
          control={control}
          name={nameof<Form>("name")}
          rules={{ required: "This field is required" }}
        />

        <ControlledTextField
          required={true}
          label="This field is required and accepts only emails"
          control={control}
          name={nameof<Form>("email")}
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "This is not a valid email address"
            },
            required: "This field is required"
          }}
        />

        <ControlledTextField
          label="This field accepts only numbers between 0-10"
          control={control}
          name={nameof<Form>("minMaxNumber")}
          type="number"
          rules={{
            min: {
              message: "Minimum value is 0",
              value: 0
            },
            max: {
              message: "Maximum value is 10",
              value: 10
            },
            valueAsNumber: true
          }}
        />

        <div>
          <ControlledTextFieldAsync
            label="Async validation, pases validation if value is 'spfx'. Validates only on button click"
            control={control}
            setValue={setValue}
            name={nameof<Form>("asyncValidate")}
            rules={{
              validate: async (value) => {
                if (getValues("combobox") === "A") {
                  if (value) {
                    if (value && vercpf(value)) {
                      return true;
                    } else {
                      return "CPF inválido";
                    }
                  }
                  return "Preencha CPF";
                } else if (getValues("combobox") === "E") {
                  if (value) {
                    if (value && verCNPJ(value)) {
                      return true;
                    } else {
                      return "CNPJ inválido";
                    }
                  }
                  return "Preencha CNPJ";
                }
                return "Escolha outra opção";
              }
            }}
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
          rules={{
            validate: {
              notOne: (value) =>
                value !== "1" || '"1" is not a valid value here',
              notZero: (value) =>
                value !== "0" || '"0" is not a valid value here'
            }
          }}
        />

        <ControlledDatePicker
          isRequired={true}
          label="This is a required date picker"
          control={control}
          name={nameof<Form>("datePicker")}
          rules={{ required: "Date is required" }}
        />

        <ControlledDatePicker
          isRequired={true}
          minDate={new Date()}
          label="This date picker requires a min date to be greater than today"
          control={control}
          name={nameof<Form>("minDate")}
          rules={{
            required: "Date is required",
            validate: (data: string) => {
              return (
                new Date(data) > new Date() ||
                "The date should be greater than today"
              );
            }
          }}
        />

        <ControlledCombobox
          required={true}
          options={comboboxItems}
          label="This is a required combobox"
          control={control}
          name={nameof<Form>("combobox")}
          placeholder="Select a value"
          rules={{ required: "Please select a value" }}
        />

        <ControlledDropdown
          required={true}
          options={comboboxItems}
          label="This is a required dropdown"
          control={control}
          name={nameof<Form>("dropdown")}
          placeholder="Select a value"
          rules={{ required: "Please select a value" }}
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
