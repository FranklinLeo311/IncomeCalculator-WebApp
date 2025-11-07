import { WarningFilled } from "@carbon/icons-react";
import { useMemo, useEffect } from "react";
import { capitalizeFirstLetter } from "../utils/commonFunctions";
import { Tooltip } from "react-tooltip";
import { Checkbox, Select } from "antd";

interface OptionWithValue {
  label: string;
  value: string;
  defaultPermission?: string;
  disabled?: boolean;
}

type KeyConfig = {
  value: string;
  label: string;
};

interface MultiSelectDropdownProps {
  options: OptionWithValue[];
  label?: string;
  titleText?: string;
  helperText?: string;
  onChange: (selected: any | null | undefined) => void;
  disabled?: boolean;
  readOnly?: boolean;
  value: string;
  size?: "small" | "middle" | "large";
  virtual?: boolean;
  required?: boolean;
  inValid?: string | boolean;
  warn?: boolean;
  warnText?: string;
  name: string;
  placeholder?: string;
  className?: string;
  keyConfig?: KeyConfig;
}

const noRecordsOption = [
  { label: "No record found", value: "", disabled: true },
];

const MultiSelectDropdown = ({
  options = [],
  label = "",
  onChange,
  value = "",
  name = "",
  size = "small",
  virtual = false,
  inValid = "",
  className = "",
  required = false,
  keyConfig,
  placeholder = "Select a role",
  ...rest
}: MultiSelectDropdownProps) => {

  const selectedValues = useMemo(() => {
    return value.split(",").filter((v) => v.trim() !== "");
  }, [value]);

  useEffect(() => {
    if (!options || options.length === 0) return;

    const defaultPermissionStr = options[0]?.defaultPermission || "";

    const defaultPermissionValues = defaultPermissionStr
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    const commaSeparatedValue = defaultPermissionValues.join(",");

    onChange({ name, value: commaSeparatedValue });
  }, [options]);

  const handleChange = (selectedValueArray: string[]) => {
    const commaSeparatedValue = selectedValueArray.join(",");
    onChange({ name, value: commaSeparatedValue });
  };

  const id = useMemo(
    () => `select_${Math.floor(100 + Math.random() * 900)}`,
    []
  );

  const displayValue = selectedValues.length === 0 ? [] : selectedValues;

  const optionRender = (option: any) => {
    const isSelected = selectedValues.includes(option.value);
    return (
      <div
        style={{ display: "flex", alignItems: "center" }}
        onMouseDown={(e) => {
          e.preventDefault();

          e.stopPropagation();
        }}
      >
        <Checkbox checked={isSelected} />
        <span className="ml-3">{option.label}</span>
      </div>
    );
  };

  return (
    <div
      className={`relative ${
        inValid && " input-invalid"
      } ${className} field-${name}`}
    >
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {required && (
            <span className="text-red-500 absolute left-[-10px] top-[-2px]">
              *
            </span>
          )}

          {label}
        </label>
      )}

      <Select
        id={id}
        mode="multiple"
        options={options.length === 0 ? noRecordsOption : options}
        value={displayValue}
        titleText={label}
        onChange={handleChange}
        size={size}
        maxTagCount="responsive"
        className="dark:bg-gray-900 dark:text-gray-200 w-[100%]"
        allowClear={true}
        placeholder={placeholder}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        optionRender={optionRender}
        {...rest}
      />

      {inValid && (
        <>
          <span
            data-tooltip-id={`${id}-tooltip`}
            className="cds--text-input__invalid-icon cursor-pointer translate-y-3 -translate-x-1"
          >
            <WarningFilled size={14} fill="var(--rl-red)" />
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

export default MultiSelectDropdown;
