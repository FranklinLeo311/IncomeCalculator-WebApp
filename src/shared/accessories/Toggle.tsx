import { Toggle } from "@carbon/react";

interface ToggleProps {
  labelA: string;
  labelB: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  // change here Logesh
}

const ToggleComponent = ({
  labelA = "",
  labelB = "",
  checked = false,
  onChange = () => {},
  ...rest
}: ToggleProps) => {
  const id = `toggle_${Math.floor(100 + Math.random() * 900)}`;
  return (
    <Toggle
      {...rest}
      labelA={labelA}
      labelB={labelB}
      toggled={checked}
      onToggle={onChange}
      id={id}
    />
  );
};
export default ToggleComponent;
// 