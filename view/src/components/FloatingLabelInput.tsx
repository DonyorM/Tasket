import React from "react";

type InputProps = React.HTMLProps<HTMLInputElement> & {
  onValueChange?: (value: string) => void;
  onEnterPress?: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
};

// Pulled from https://dev.to/chrsgrrtt/floating-label-input-with-react-and-tailwind-2e5h. Thanks to Chris Garrett
export default function FloatingLabelInput({
  type,
  name,
  children,
  className,
  value,
  onChange,
  onValueChange,
  onEnterPress,
  inputRef,
  ...props
}: InputProps) {
  const [active, setActive] = React.useState(false);

  function handleActivation(e: any) {
    setActive(!!e.target.value);
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  }

  function keyPress(e: any) {
    if (e.keyCode === 13) {
      if (onEnterPress) {
        onEnterPress(e.target.value);
      }
    }
  }

  return (
    <div
      className={`relative border rounded bg-gray-600 text-white border-white border-opacity-25 ${className}`}
    >
      <input
        className={[
          "outline-none w-full rounded bg-transparent text-sm transition-all duration-200 ease-in-out p-2",
          active ? "pt-6" : "",
        ].join(" ")}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleActivation}
        onKeyDown={keyPress}
        ref={inputRef}
        {...props}
      />
      <label
        className={[
          "absolute top-0 left-0 flex items-center text-white text-opacity-50 p-2 transition-all duration-200 ease-in-out",
          active ? "text-xs" : "text-sm",
        ].join(" ")}
        htmlFor={name}
      >
        {children}
      </label>
    </div>
  );
}
