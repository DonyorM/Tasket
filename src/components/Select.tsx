import React from "react";

type SelectProps = React.HTMLProps<HTMLSelectElement> & {
  onValueChange?: (value: any) => void;
};

export default function Select({ children, className, onChange, onValueChange, ...props }: SelectProps) {

  function onSelect(e: any) {
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <select
        className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      bg-gray-600 text-white text-opacity-50 border-white/50 bg-clip-padding bg-no-repeat
      border border-solid
      rounded
      transition
      ease-in-out
      m-0
      focus:text-white/50 focus:bg-gray-600 focus:border-blue-600 focus:outline-none"
        aria-label="Default select example"
        onChange={onSelect}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
