
// how to use
{/* <Button type="secondary" onClick={onClose} label="Cancel" /> */}
import { ElementType, FC, JSX } from "react";
import { Button as CarbonButton } from "@carbon/react";

interface ButtonProps {
  label?: string | JSX.Element;
  type?:
    | "secondary"
    | "primary"
    | "tertiary"
    | "ghost"
    | "danger"
    | "danger--primary"
    | "danger--ghost"
    | "danger--tertiary"
    | undefined;
  htmlType?: "submit" | "button" | "reset";
  icon?: ElementType;
  tabIndex?: number;
  className?: string;
  [key: string]: any; // to allow additional props like onClick, disabled, etc.
}

const Button: FC<ButtonProps> = ({
  label = "",
  type = "primary",
  icon,
  tabIndex,
  className = "",
  htmlType = "button",
  ...rest
}) => {
  return (
    <CarbonButton
      {...rest}
      as="button"
      type={htmlType}
      className={`btn-carbon ${className}`}
      kind={type}
      renderIcon={icon}
      tabIndex={tabIndex}
    >
      {label}
    </CarbonButton>
  );
};

export default Button;
