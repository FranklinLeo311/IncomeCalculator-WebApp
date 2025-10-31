// how to use
{/* <SingleDropdown
              label="Effective From"
              options={effectiveDateListOptions}
              onChange={handleChange}
              name="effectiveDateValue"
              value={Number(inputDetails.effectiveDateValue)}
              placeholder="Select Effective Date"
              className="w-[200px]"
            /> */}
import { WarningFilled } from "@carbon/icons-react";
import { ComboBox } from "@carbon/react";
import { Tooltip } from "react-tooltip";
import { useMemo, useState } from "react";
import { capitalizeFirstLetter } from "../utils/commonFunctions";
import { handleUpdateKey } from "./MultiSelectDropdown";

interface SingleDropdownProps {
  options: { label: string; value: string | number; disabled?: boolean }[];
  itemToString?: (item: any | null | undefined) => string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  onChange: (selected: any | null | undefined) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  selectedItem?: any | null | undefined;
  size?: "sm" | "md" | "lg";
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
  keyConfig?: { value: string; label: string };
}
const noRecordsOption = [
  { label: "No record found", value: "", disabled: true },
];

const SingleDropdown = (props: SingleDropdownProps) => {
  let {
    options: iOptions = [],
    onChange,
    label = "",
    size = "sm",
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
    if (e["inputValue"]) return;
    setIsOpen(false);

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

  return (
    <div
      className={`dropdown-field relative small-padding ${
        inValid && "input-invalid"
      } ${
        exceptionField && "exception-dropdown-field"
      } ${className} field-${name}`}
    >
      <ComboBox
        {...rest}
        selectedItem={selectedItem}
        initialSelectedItem={selectedItem}
        titleText={label}
        items={filteredOptions}
        placeholder={placeholder || label}
        onChange={handleChange}
        onInputChange={setInputValue}
        itemToString={(item) =>
          item && typeof item === "object" && "label" in item
            ? item.label
            : item
            ? String(item)
            : ""
        }
        shouldFilterItem={() => true}
        size={size}
        direction={direction}
        onKeyDownCapture={(e) => {
          if (["Enter", "Tab"].includes(e.key)) {
            setInputValue("");

            const targetElement = e.target as HTMLElement;
            const highlightedItem = targetElement
              .closest(".cds--list-box")
              ?.querySelector<HTMLLIElement>(
                "ul.cds--list-box__menu li.cds--list-box__menu-item--highlighted"
              );

            if (highlightedItem) {
              e.preventDefault();
              e.stopPropagation();
              highlightedItem.click();
            }
          }
        }}
        title={selectedItem ? selectedItem["label"] : ""}
        onClickCapture={(e: React.MouseEvent<HTMLElement>) => {
          const willOpen = !isOpen;
          setIsOpen(willOpen);
          willOpen ? onFocus() : onBlur();

          setTimeout(() => {
            const targetElement = e.target as HTMLElement,
              optionElement = targetElement
                .closest(".cds--list-box")
                ?.querySelector<HTMLLIElement>("ul.cds--list-box__menu"),
              listItems = Array.from(
                targetElement
                  .closest(".cds--list-box")
                  ?.querySelectorAll<HTMLLIElement>(
                    "ul.cds--list-box__menu li"
                  ) || []
              );
            let isActiveItemFound = false;
            listItems.forEach((el) => {
              if (
                !selectedItem?.["disabled"] &&
                el.textContent?.trim() === selectedItem?.label &&
                willOpen
              ) {
                el.classList.add("cds--list-box-active");
                const activeItem = document.querySelector(
                  ".cds--list-box-active"
                ) as HTMLElement | null;

                if (activeItem && !activeItem.querySelector("svg")) {
                  el.click();
                  isActiveItemFound = true;

                  setTimeout(() => {
                    const triggerElement = document.getElementById(id);
                    if (triggerElement) {
                      triggerElement.click();

                      if (optionElement) optionElement.style.opacity = "1";
                    }
                  }, 100);
                }
              }
            });
            if (optionElement && !isActiveItemFound) {
              optionElement.style.opacity = "1";
            }
            if (optionElement && exceptionField) {
              const { width, left, bottom } =
                targetElement.getBoundingClientRect();
              optionElement.style.width = width + "px";
              optionElement.style.left = left + "px";
              optionElement.style.top = bottom + "px";
              optionElement.style.position = "fixed";
            }
          }, 0);
        }}
        id={id}
      />
      <div
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

export default SingleDropdown;
