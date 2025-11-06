// how to use
{
  /* <SingleDropdown
              label="Effective From"
              options={effectiveDateListOptions}
              onChange={handleChange}
              name="effectiveDateValue"
              value={Number(inputDetails.effectiveDateValue)}
              placeholder="Select Effective Date"
              className="w-[200px]"
            /> */
}
import { WarningFilled } from "@carbon/icons-react";
import { Checkbox, Select, Space } from "antd";
import { Tooltip } from "react-tooltip";
import { useMemo, useState } from "react";
import { capitalizeFirstLetter } from "../utils/commonFunctions";
import { handleUpdateKey } from "./MultiSelectDropdown";
import { CheckOutlined } from "@ant-design/icons";

interface SingleDropdownProps {
  options: { label: string; value: string | number; disabled?: boolean }[];
  itemToString?: (item: any | null | undefined) => string;
  label?: string;
  placeholder?: string;
  multiSelect?: boolean;
  helperText?: string;
  onChange: (selected: any | null | undefined) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  selectedItem?: any | null | undefined;
  size?: "small" | "middle" | "large";
  allowCustomValue?: boolean;
  inValid?: string | boolean;
  warn?: boolean;
  warnText?: string;
  name: string;
  value: string | number | null;
  className?: string;
  direction?: "top" | "bottom";
  exceptionField?: boolean;
  includeZero?: boolean;
  required?: boolean;
  keyConfig?: { value: string; label: string };
}
const noRecordsOption = [
  { label: "No record found", value: "", disabled: true },
];

const SingleDropdown = (props: SingleDropdownProps) => {
  let {
    options: iOptions = [],
    onChange,
    multiSelect = false,
    label = "",
    size = "small",
    name,
    value,
    className = "",
    placeholder,
    inValid = "",
    direction = "bottom",
    keyConfig,
    onFocus = () => {},
    onBlur = () => {},
    exceptionField = false,
    includeZero = false,
    required = true,
    ...rest
  } = props;

  const isNotNumber = name.toLocaleLowerCase().includes("state");

  const options = useMemo(() => {
    return keyConfig
      ? handleUpdateKey({ keyConfig, options: iOptions })
      : iOptions.map((item) => ({
          ...item,
          disabled: Boolean(item.disabled),
        }));
  }, [iOptions, keyConfig]);

  if (!isNotNumber) value = Number(value) ?? null;

  const [inputValue, setInputValue] = useState(""),
    [isOpen, setIsOpen] = useState<Boolean>(false);

  const selectedItemValue = useMemo(() => {
    if (value !== null && value !== undefined) {
      const selected = options?.find((option: any) =>
        isNotNumber
          ? option["value"] === value
          : Number(option["value"]) === Number(value)
      );
      return selected || null;
    }
    return null;
  }, [value, options]);

  const handleChange = (e: any) => {
    // if (e["inputValue"]) return;
    // setIsOpen(false);

    const selected = e["selectedItem"]
      ? typeof e["selectedItem"] === "object"
        ? e["selectedItem"]["value"]
        : e["selectedItem"]
      : "";

    onChange({ name, value: selected });
    setInputValue("");
    if (e["selectedItem"] === undefined) {
      setTimeout(() => {
        document.getElementById(id)?.focus();
        document.getElementById(id)?.blur();
      }, 100);
    }
  };

  const selectedItem = useMemo(() => {
    if (value || includeZero) {
      const selected = options.find((option: any) =>
        isNotNumber
          ? option["value"] === value
          : Number(option["value"]) === Number(value)
      );
      return selected || null;
    }
    return null;
  }, [value, options]);

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    const selectedLabel = selectedItemValue?.label?.toLowerCase() || "";

    const showAll = !query || query === selectedLabel;
    if (showAll) return options.length === 0 ? noRecordsOption : options;

    const matches = options.filter((item) =>
      item.label.toLowerCase().includes(query)
    );

    return matches.length > 0 ? matches : noRecordsOption;
  }, [options, inputValue, selectedItemValue, selectedItem]);

  //Commenting this useEffect to avoid auto focus on dropdown
  // useEffect(() => {
  //   if (selectedItem === null) {
  //     const selectElement = document.getElementById(id);
  //     const selectionElement = selectElement?.parentElement?.querySelector(
  //       ".cds--list-box__selection"
  //     ) as HTMLElement | null;

  //     if (selectionElement) {
  //       selectionElement.click();
  //     }
  //   }
  // }, [selectedItem]);

  const id = useMemo(
    () => `select_${Math.floor(100 + Math.random() * 900)}`,
    []
  );
  const tempOptions = [
    { value: "jack", label: "Jack", isSelected: true },
    { value: "lucy", label: "Lucy" },
    { value: "Yiminghe", label: "yiminghe" },
    { value: "disabled", label: "Disabled", disabled: true },
  ];

  return (
    <div
      className={`dropdown-field relative small-padding ${
        inValid && "input-invalid"
      } ${
        exceptionField && "exception-dropdown-field"
      } ${className} field-${name}`}
    >
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {required && (
          <span className="text-red-500 absolute left-[-10px] top-[-2px]">
            *
          </span>
        )}
        {label}
      </label>
      <Select
        {...rest}
        mode={multiSelect ? "multiple" : undefined}
        maxTagCount="responsive"
        options={tempOptions}
        placeholder={placeholder || label}
        onChange={handleChange}
        optionFilterProp={"label"}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        // optionRender={(option) => (
        //   <Space>
        //     <span role="img" aria-label={option.data.label}>
        //       <Checkbox checked={false} />
        //     </span>
        //     {option.data.label}
        //   </Space>
        // )}
        title={selectedItem ? selectedItem["label"] : ""}
        menuItemSelectedIcon ={null}
        id={id}
        allowClear={true}
        size={size}
        virtual={true}
        className="w-[200px]"
      />
      {/* <div
        className="caret-zone"
        id={`${id}-caret-zone`}
        title="Open menu"
        onClick={(e) => {
          try {
            if (!isOpen) {
              (e.target as HTMLElement).parentElement
                ?.querySelector(".cds--text-input")
                ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          } catch (error) {}
        }}
      /> */}
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

export default SingleDropdown;
