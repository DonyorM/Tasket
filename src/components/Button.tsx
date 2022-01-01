import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { Link, LinkProps } from "react-router-dom";

interface CustomButtonProps {
  Component: React.ComponentType | string | any;
}

type ButtonProps = React.HTMLProps<HTMLButtonElement>;

export const BaseButton: React.FC<any> = ({
  className,
  Component,
  children,
  ringColor,
  ...remaining
}: any) => {
  return (
    <Component
      className={`inline-block px-3 py-2 rounded-md bg-transparent text-gray-300 ring-1 ${ringColor} hover:text-red-900 ${
        className || ""
      }`}
      {...remaining}
    >
      {children}
    </Component>
  );
};

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  return <BaseButton Component={"button"} ringColor="ring-gray-500" {...props} />;
};

export const DarkBorderButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  return <BaseButton Component={"button"} ringColor="ring-gray-900" {...props} />;
};

type LinkButtonProps = LinkProps & {
  variant?: string
}

export const LinkButton: React.FC<LinkButtonProps> = ({variant, ...props}: LinkButtonProps) => {
  const Component = variant === "dark" ? DarkBorderButton : Button;
  return (
    <Link {...props}>
      <Component>{props.children}</Component>
    </Link>
  );
};

type IconButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  width?: string;
  height?: string;
  size?: number;
};

export const IconButton: React.FC<IconButtonProps> = ({
  width,
  height,
  size,
  children,
  className,
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center rounded-full
      text-gray-300 ring-1 ring-gray-500 hover:bg-red-900
      ${width || "w-5"} ${height || "h-5"} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
