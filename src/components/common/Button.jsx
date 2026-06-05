const VARIANT_CLASS = {
  primary: "tg-btn tg-btn--primary",
  secondary: "tg-btn tg-btn--secondary",
  outline: "tg-btn tg-btn--outline",
  ghost: "tg-btn tg-btn--ghost",
};

const SIZE_CLASS = {
  sm: "tg-btn--sm",
  md: "tg-btn--md",
  lg: "tg-btn--lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) {
  const classes = [
    VARIANT_CLASS[variant] || VARIANT_CLASS.primary,
    SIZE_CLASS[size] || SIZE_CLASS.md,
    fullWidth ? "tg-btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
