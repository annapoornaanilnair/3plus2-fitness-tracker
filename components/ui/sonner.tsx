"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const themeContext = useContext(ThemeContext);
  const mode = themeContext?.mode || 'light';
  const toastTheme = mode === 'dark' ? 'dark' : 'light';

  return (
    <Sonner
      theme={toastTheme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
