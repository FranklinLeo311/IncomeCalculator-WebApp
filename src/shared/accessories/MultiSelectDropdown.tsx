// how to use
{/* <MultiSelectDropdown
              label="Product Category"
              options={productCategoryOptions}
              name="productCategory"
              value={searchInputs.productCategory || ""}
              onChange={handleUpdateSearchInputs}
              inValid={formValidationDetails.productCategory}
            /> */}
import { WarningFilled } from "@carbon/icons-react";
import { MultiSelect } from "@carbon/react";
import { useMemo } from "react";
import { capitalizeFirstLetter } from "../utils/commonFunctions";
import { Tooltip } from "react-tooltip";

interface OptionWithValue {
  label: string;
  value: number | string;
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
  value: number | null;
  size?: "sm" | "md" | "lg";
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

interface HandleUpdateKeyParams {
  keyConfig: KeyConfig;
  options: { [key: string]: any };
}

export const handleUpdateKey = ({
  keyConfig: { value: k, label: l },
  options,
}: HandleUpdateKeyParams): { value: any; label: any; disabled?: boolean }[] => {
  return options.map((option: any) => ({
    value: option[k],
    label: option[l],
    disabled: Boolean(option["disabled"]),
  }));
};

const MultiSelectDropdown = ({
  options: iOptions = [],
  label = "",
  onChange,
  value = null,
  name = "",
  size = "sm",
  inValid = "",
  className = "",
  keyConfig,
  ...rest
}: MultiSelectDropdownProps) => {
  value = Number(value);

  let options = useMemo(() => {
    return keyConfig
      ? handleUpdateKey({ keyConfig, options: iOptions })
      : iOptions.map((item) => ({
          ...item,
          disabled: Boolean(item.disabled),
        }));
  }, [iOptions, keyConfig]);

  options = options.length === 0 ? noRecordsOption : options;

  const { selectedItems, selectedItemText } = useMemo(() => {
      if (!value) {
        return { selectedItems: [], selectedItemText: "" };
      }
      const selectedItems = options.filter(
          ({ value: iValue, disabled = false }) =>
            !disabled && (value & Number(iValue)) === Number(iValue)
        ),
        selectedItemText = selectedItems.map((item) => item.label).join(", ");

      return { selectedItems, selectedItemText };
    }, [options, value]),
    handleChange = (data: { selectedItems: OptionWithValue[] }) => {
      const bitwiseValue = data.selectedItems.reduce(
        (acc, curr) => acc | Number(curr.value),
        0
      );
      onChange({ name, value: bitwiseValue });
    };

  const id = useMemo(
    () => Math.floor(100 + Math.random() * 900).toString(),
    [name]
  );

  return (
    <div
      className={`${
        inValid && "relative input-invalid"
      } ${className} field-${name}`}
    >
      <MultiSelect
        id={id}
        items={options}
        sortItems={(e: OptionWithValue[]) => e}
        itemToString={(item) => item?.label || ""}
        label={selectedItemText || label}
        titleText={label}
        selectedItems={selectedItems}
        onChange={handleChange}
        size={size}
        {...rest}
      />
      {/* {inValid && (
        <Tooltip
          label={inValid || "Invalid input"}
          align="top"
          className="cds--text-input__invalid-icon !absolute cursor-pointer"
          style={{ "inset-block-start": "72%", "inset-inline-end": "1.5rem" }}
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
