// how to use
{
  /* <InputField
                      label="Last Name"
                      name="lastName"
                      value={lastName}
                      onChange={handlePropertyDetails}
                      inValid={eLastName}
                    /> */
}

import { useState, ChangeEvent, useEffect, useMemo } from "react";
import { Form, Input } from "antd";
import { capitalizeFirstLetter, cleanValue } from "../utils/commonFunctions";
import {
  formatCellPhone,
  formatCurrency,
  formatDate,
  formatPercentage,
  formatSSN,
} from "../utils/formatFunctions";
import { WarningFilled } from "@ant-design/icons";
import { Tooltip } from "react-tooltip";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  decimalPoints?: number;
  formatType?:
    | "."
    | "$"
    | "%"
    | "ssn"
    | "phone"
    | "number"
    | "default"
    | "date"
    | "name"
    | "";
  value: string | number | null;
  name?: string;
  onChange: any; //(params: object) => void; // Check Here - Logesh
  onBlur?: (params: object) => void;
  onFocus?: (params: object) => void;
  size?: "small" | "middle" | "large";
  className?: string;
  charLength?: number | undefined;
  inValid?: string;
  inValidText?: string;
  inValidException?: boolean;
  autoFocus?: boolean;
  allowNegative?: boolean;
  title?: string;
  disabled?: boolean;
  required?: boolean;
}

const InputField = ({
  label = "",
  placeholder = "",
  decimalPoints = 2,
  formatType = "",
  value: inputValue,
  onBlur = () => {},
  onFocus = () => {},
  onChange = () => {},
  name = "",
  size = "small",
  className = "",
  charLength = undefined,
  inValid = "",
  inValidException = false,
  required = false,
  allowNegative = false,
  ...textInputProps
}: InputFieldProps) => {
  const [value, setValue] = useState<string | number | null>(inputValue ?? ""),
    [isFocused, setIsFocused] = useState(false);

  const iAllowNegative = useMemo(() => {
    return allowNegative && ["default", ""].includes(formatType);
  }, [allowNegative, formatType]);

  const isCapitalize = useMemo(() => {
    const pattern = /name|city/i;
    return pattern.test(name.toLocaleLowerCase());
  }, [name]);

  const handleNameChange = (input: string) => {
    input = input
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/^\s+/g, "")
      .replace(/\s{2,}/g, " ");
    return input;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value;

    if (["default", ""].includes(formatType)) {
      setValue(input);
    } else if (["number", "ssn", "phone"].includes(formatType)) {
      input = input.replace(/[^0-9.]/g, "");
      if (decimalPoints === 0 || ["ssn", "phone"].includes(formatType)) {
        input = input.replace(/[^0-9]/g, "");
      }
      setValue(input);
    } else if (formatType === "date") {
      input = input.replace(/[^0-9/-]/g, "");
      setValue(input);
    } else if (formatType === "name") {
      input = handleNameChange(input);
      setValue(input);
    } else {
      if (!iAllowNegative) {
        input = input.replace(/[^0-9.]/g, "");
      }
      const dotCount = (input.match(/\./g) || []).length;
      if (dotCount > 1) return;
      // Trim the decimal part of the input if it's longer than the allowed number of decimal points
      if (["$", "%", "."].includes(formatType)) {
        const [intPart, decimalPart] = input.split(".");
        if (decimalPart && decimalPart.length > decimalPoints) {
          input = `${intPart}.${decimalPart.slice(0, decimalPoints)}`;
        }
      }
      setValue(input);
    }

    onChange({
      value: input,
      name,
    });
  };

  const handleFocus = () => {
    setIsFocused(true);

    let cleaned: any = cleanValue(String(value), iAllowNegative);

    if (["default"].includes(formatType)) {
      cleaned = value || "";
      setValue(cleaned);
    } else if (["$", "%"].includes(formatType)) {
      if (Number(cleaned) === 0) {
        setValue("");
      } else {
        setValue(String(parseFloat(cleaned)));
      }
    } else if (formatType === "." && value) {
      setValue(String(parseFloat(cleaned)));
    } else if (["ssn", "phone"].includes(formatType) && value) {
      cleaned = cleaned === "0" ? "" : cleaned;
      setValue(cleaned || "");
    }

    onFocus?.({ value: cleaned });
  };

  const getValue = (value: any) => {
    let cleanedValue = cleanValue(value, iAllowNegative) || 0,
      formattedValue: string | null | number = "";

    if (formatType === "") {
      formattedValue = value || "";
    } else if (formatType === "ssn") {
      formattedValue = formatSSN(cleanedValue) || "";
    } else if (formatType === "date") {
      formattedValue = formatDate(value) || "";
    } else if (formatType === "phone") {
      formattedValue = formatCellPhone(cleanedValue) || "";
    } else if (formatType === "$") {
      formattedValue = formatCurrency(cleanedValue, decimalPoints) || "";
    } else if (formatType === "%") {
      formattedValue = formatPercentage(cleanedValue, decimalPoints);
    } else if (cleanedValue === "" || cleanedValue === ".") {
      formattedValue = (0).toFixed(decimalPoints);
    } else if (formatType === "number") {
      formattedValue = Number(cleanedValue);
    } else if (formatType === "name") {
      formattedValue = handleNameChange(value);
    } else if (!isNaN(parseFloat(String(cleanedValue)))) {
      formattedValue = parseFloat(String(cleanedValue)).toFixed(decimalPoints);
    } else {
      formattedValue = null;
    }

    if (
      ["ssn", "phone", "number", "date"].includes(formatType) &&
      (Number(cleanedValue) === 0 || Number(formattedValue) === 0)
    ) {
      cleanedValue = "";
      formattedValue = "";
    }
    if (name === "zipCode" || ["default"].includes(formatType)) {
      formattedValue = value;
      cleanedValue = value;
    }
    return {
      formateValue: formattedValue,
      cleanedValue,
    };
  };

  const handleBlur = () => {
    if (value !== "" && value !== null && String(value).trim() !== "") {
      if (["date", "", "default"].includes(formatType)) {
        const { formateValue } = getValue(value);

        const formattedValue =
          typeof formateValue === "string" && isCapitalize
            ? formateValue.charAt(0).toUpperCase() + formateValue.slice(1)
            : formateValue;

        setValue(formattedValue);
        onChange({ name, value: formattedValue });
        onBlur({ value: formattedValue });
      } else {
        const trimmedValue = String(value).trim();
        const formattedValue =
          typeof trimmedValue === "string" && isCapitalize
            ? trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1)
            : trimmedValue;
        let { formateValue, cleanedValue } = getValue(formattedValue);
        setValue(formateValue);
        if (
          ["$", "%", "number", "."].includes(formatType) &&
          name !== "zipCode"
        ) {
          cleanedValue = Number(cleanedValue);
        }
        onChange({ name, value: cleanedValue });
        onBlur({ value: cleanedValue });
      }
    } else if (formatType === "name") {
      const input = handleNameChange(value as string);
      setValue(input);
    } else {
      if (["$", "%", "number", "."].includes(formatType)) {
        const { formateValue } = getValue(0);
        setValue(formateValue);
        onChange({ name, value: 0 });
        onBlur({ value: 0 });
      } else {
        setValue("");
        onChange({ name, value: "" });
        onBlur({ value: "" });
      }
    }

    setIsFocused(false);
  };

  useEffect(
    () =>
      setValue(isFocused ? inputValue : getValue(inputValue)["formateValue"]),
    [inputValue, isFocused]
  );

  const id = `input_${Math.floor(100 + Math.random() * 900)}`;

  if (["$", "%"].includes(formatType)) {
    inValid = Number(cleanValue(String(value))) > 0 ? "" : inValid;
  } else {
    inValid =
      (value || "").toString().trim().length > 0 && !inValidException
        ? ""
        : inValid;
  }

  return (
    <div
      className={`input-field relative small-padding ${
        inValid && "input-invalid"
      } ${className} field-${name}`}
    >

      <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
      { required && <span className="text-red-500 absolute left-[-10px]">*</span> }
        {label}
      </label>
      <Input
        {...textInputProps}
        type="text"
        // size={size}
        size="large"
        placeholder={placeholder || label}
        value={value || ""}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        id={id}
        maxLength={
          charLength ??
          (["%", "$", "number"].includes(formatType) ? 16 : undefined)
        }
        title={value ? value.toString() : placeholder || label}
        disabled={textInputProps["disabled"]}
        status={inValid ? "error" : ""}
        className="dark:bg-gray-900 dark:text-gray-200 w-[100%]"
      />

      {/* {inValid && (
        <Tooltip
          label={inValid || "Invalid input"}
          align="top"
          className="cds--text-input__invalid-icon !absolute cursor-pointer"
          style={{ "inset-block-start": "70%" }}
        >
          <WarningFilled size={14} fill="var(--rl-red)" />
        </Tooltip>
      )} */}

      {inValid && (
        <>
          <span
            data-tooltip-id={`${id}-tooltip`}
            className="cds--text-input__invalid-icon cursor-pointer translate-y-3 -translate-x-1"
          >
             <WarningFilled size={14} color="var(--rl-red)" />
          </span>

          <Tooltip
            id={`${id}-tooltip`}
            variant="dark"
            className="tooltip-default"
            content={capitalizeFirstLetter(inValid) || "Invalid input"}
          />
        </>
      )}
    </div>
  );
};

export default InputField;
