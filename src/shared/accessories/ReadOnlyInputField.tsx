import React from "react";

interface ReadOnlyInputFieldProps {
  label?: string;
  value?: string | number | null;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}

const ReadOnlyInputField: React.FC<ReadOnlyInputFieldProps> = ({
  label = "",
  value = "",
  placeholder = "",
  required = false,
  className = "",
  inputClassName = "",
}) => {
  const id = `input_${Math.floor(100 + Math.random() * 900)}`;

  return (
    <div
      className={`relative flex flex-row items-center px-2 pt-1 pb-2 gap-6 w-[38%] h-[40px] bg-[#f7f7f7] border-b border-[#bbbbbb] rounded cursor-pointer shadow-[0_1px_3px_0_#00000008] mt-[3%] font-[Creato_Display] text-[#303030] ${className}`}
    >
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {required && (
            <span className="text-red-500 absolute left-[-10px] top-[-2px]">*</span>
          )}
          {label}
        </label>
      )}

      <input
        id={id}
        type="text"
        value={value ?? ""}
        placeholder={placeholder || label}
        readOnly
        disabled
        title={placeholder || label}
        className={`flex-1 bg-transparent border-none focus:outline-none cursor-default text-[#303030] ${inputClassName}`}
      />
    </div>
  );
};

export default ReadOnlyInputField;
