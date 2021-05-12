import * as React from "react";
import {
  IComboBoxOption,
  PrimaryButton,
  Spinner
} from "office-ui-fabric-react";
import { FC, useState } from "react";
import { DeepMap, FieldError, useForm } from "react-hook-form";
import { ControlledCombobox } from "../fluent-rhf/ControlledCombobox";
import { nameof, sleep } from "../utils";
import { ControlledTextFieldAsync } from "../fluent-rhf/ControlledTextFieldAsync";

type Form = {
  name: string;
  asyncValidate: string;
  multiCustomValidation: string;
  combobox: string;
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
      name: ""
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
      cpf === "00000000000" ||
      cpf === "11111111111" ||
      cpf === "22222222222" ||
      cpf === "33333333333" ||
      cpf === "44444444444" ||
      cpf === "55555555555" ||
      cpf === "66666666666" ||
      cpf === "77777777777" ||
      cpf === "88888888888" ||
      cpf === "99999999999"
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
      <div style={{ margin: "15px" }}>
        <div>
          <ControlledCombobox
            required={true}
            options={comboboxItems}
            label="Regime tributação"
            control={control}
            name={nameof<Form>("combobox")}
            placeholder="Select a value"
            rules={{ required: "Escolha o regime" }}
          />

          <ControlledTextFieldAsync
            required={true}
            label="Documento"
            control={control}
            setValue={setValue}
            name={nameof<Form>("asyncValidate")}
            rules={{
              validate: async (value) => {
                if (getValues("combobox") === "A") {
                  if (vercpf(value)) {
                    return true;
                  } else {
                    return value ? "CPF inválido" : "Campo requerido";
                  }
                } else if (
                  getValues("combobox") !== "A" &&
                  getValues("combobox") !== "B"
                ) {
                  if (value && verCNPJ(value)) {
                    return true;
                  } else {
                    return "CNPJ inválido";
                  }
                }
                return "Campo requerido";
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

        <div style={{ padding: "10px 0", textAlign: "left" }}>
          <PrimaryButton onClick={onSave} text="Salvar" />
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
