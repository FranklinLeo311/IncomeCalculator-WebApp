import { Switch } from "antd";

interface ToggleProps {
  labelA: string;
  labelB: string;
  checked: boolean;
  label?: string;
  onChange: (checked: boolean) => void;
  required?: boolean;
  size?: "small" | "default";
  // change here Logesh
}

const ToggleComponent = ({
  labelA = "",
  labelB = "",
  label = "",
  checked = false,
  onChange = () => {},
  required = false,
  size = "default",
  ...rest
}: ToggleProps) => {
  const id = `toggle_${Math.floor(100 + Math.random() * 900)}`;
  const valueText = checked ? labelA : labelB;
  return (
     <div
      className={`relative input-invalid field-${name}`}
    >
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
      <Switch
        {...rest}
        checked={checked}
        onChange={onChange}
        id={id}
        size={size}
      />
      <span
        className={`pl-2 align-middle text-gray-500 dark:text-gray-200 
      text-[${size === "small" ? "14px" : "16px"}]`}
      >
        {valueText}
      </span>
    </div>
  );
};
export default ToggleComponent;
//
