import React from "react";
import clsx from "clsx";
import NextLink from "next/link"; // если у тебя Next.js

type TextProps<T extends HTMLElement = HTMLElement> = React.PropsWithChildren &
  React.HTMLAttributes<T> & {
    className?: string;
  };


const H1 = ({
  children,
  className,
  ...props
}: TextProps<HTMLHeadingElement>) => (
  <h1
    className={clsx(
      "text-[24px] leading-[28px] font-semibold tracking-[-0.02em] text-[var(--foreground)]",
      className,
    )}
    {...props}
  >
    {children}
  </h1>
);

const H2 = ({
  children,
  className,
  ...props
}: TextProps<HTMLHeadingElement>) => (
  <h2
    className={clsx(
      "text-[14px] leading-[18px] font-semibold tracking-[-0.02em] text-[var(--foreground)]",
      className,
    )}
    {...props}
  >
    {children}
  </h2>
);

const H3 = ({
  children,
  className,
  ...props
}: TextProps<HTMLHeadingElement>) => (
  <h3
    className={clsx(
      "text-[12px] leading-[16px] font-semibold tracking-[-0.02em] text-[var(--foreground)]",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
);

// system

const Price = ({
  children,
  className,
  ...props
}: TextProps<HTMLHeadingElement>) => (
  <div
    className={clsx(
      "text-[16px] leading-[20px] font-medium tracking-[-0.02em] text-[var(--background)]",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

// paragraph

const P1 = ({ children, className, ...props }: TextProps<HTMLSpanElement>) => (
  <p
    className={clsx(
      "text-[12px] leading-[16px] font-normal tracking-[-0.02em] text-[var(--foreground)]",
      className,
    )}
    {...props}
  >
    {children}
  </p>
);

const P2 = ({ children, className, ...props }: TextProps<HTMLSpanElement>) => (
  <p
    className={clsx(
      "text-grey-600 text-[10px] leading-[12px] font-normal tracking-[-0.02em]",
      className,
    )}
    {...props}
  >
    {children}
  </p>
);

const Helper = ({
  children,
  className,
  ...props
}: TextProps<HTMLParagraphElement>) => (
  <p
    className={clsx(
      "text-[8px] leading-[10px] font-medium tracking-[-0.02em] text-[var(--foreground)]",
      className,
    )}
    {...props}
  >
    {children}
  </p>
);

export const Text = {
  H1,
  H2,
  H3,
  P1,
  P2,
  Price,
  Helper,
};