import { Switch } from "antd";

interface ToggleProps {
  labelA: string;
  labelB: string;
  checked: boolean;
  label?: string;
  onChange: (checked: boolean) => void;
  required?: boolean;
  size?: "small" | "default";
  className?: string;
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
  className = "",
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
        className="block mb-1 text-sm font-medium w-fit"
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
        className={`${className}`}
         
      />
      <span
        className={`pl-2 align-middle 
      text-[${size === "small" ? "13px" : "14px"}]`}
      >
        {valueText}
      </span>
    </div>
  );
};
export default ToggleComponent;
//
