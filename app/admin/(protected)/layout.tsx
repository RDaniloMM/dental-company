import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Toaster } from "sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen flex flex-col items-center'>
      <div className='flex-1 w-full flex flex-col gap-5 items-center'>
        <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
          <div className='w-full flex justify-between p-3 px-5 text-sm'>
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </nav>
        <div className='flex-1 flex flex-col gap-20 p-4 w-full'>
          {children}
        </div>
        <Toaster 
          position="bottom-center" 
          richColors
          closeButton
          theme="light"
        />
      </div>
    </main>
  );
}
