"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Cargar Streamdown dinámicamente
const StreamdownComponent = dynamic(
  () => import("streamdown").then((mod) => ({ default: mod.Streamdown })),
  { ssr: false, loading: () => <div className='animate-pulse'>Loading...</div> }
);

type ResponseProps = {
  className?: string;
  children?: string;
};

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <StreamdownComponent
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
