"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";

// Contexto para compartir el estado de scroll (fallback cuando el módulo no está cargado)
const ScrollContext = createContext<{
  isAtBottom: boolean;
  scrollToBottom: () => void;
}>({ isAtBottom: true, scrollToBottom: () => {} });

// Hook para cargar use-stick-to-bottom dinámicamente
function useStickToBottomModule() {
  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    import("use-stick-to-bottom").then((mod) => {
      setModule(mod);
    });
  }, []);

  return module;
}

export type ConversationProps = {
  className?: string;
  children?: ReactNode;
};

export const Conversation = ({
  className,
  children,
  ...props
}: ConversationProps) => {
  const module = useStickToBottomModule();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // Si el módulo está cargado, usar StickToBottom
  if (module?.StickToBottom) {
    const StickToBottom = module.StickToBottom;
    return (
      <StickToBottom
        className={cn("relative flex-1 overflow-y-auto", className)}
        initial='smooth'
        resize='smooth'
        role='log'
        {...props}
      >
        {children}
      </StickToBottom>
    );
  }

  // Fallback mientras carga
  return (
    <ScrollContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <div
        ref={containerRef}
        className={cn("relative flex-1 overflow-y-auto", className)}
        role='log'
        {...props}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

export type ConversationContentProps = {
  className?: string;
  children?: ReactNode;
};

export const ConversationContent = ({
  className,
  children,
  ...props
}: ConversationContentProps) => {
  const module = useStickToBottomModule();

  if (module?.StickToBottom?.Content) {
    const Content = module.StickToBottom.Content;
    return (
      <Content
        className={cn("p-4", className)}
        {...props}
      >
        {children}
      </Content>
    );
  }

  return (
    <div
      className={cn("p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className='text-muted-foreground'>{icon}</div>}
        <div className='space-y-1'>
          <h3 className='font-medium text-sm'>{title}</h3>
          {description && (
            <p className='text-muted-foreground text-sm'>{description}</p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  // Solo usar el contexto de fallback (el contexto real viene del módulo cargado dinámicamente en Conversation)
  const { isAtBottom, scrollToBottom } = useContext(ScrollContext);

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isAtBottom) {
    return null;
  }

  return (
    <Button
      className={cn(
        "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full",
        className
      )}
      onClick={handleScrollToBottom}
      size='icon'
      type='button'
      variant='outline'
      {...props}
    >
      <ArrowDownIcon className='size-4' />
    </Button>
  );
};
