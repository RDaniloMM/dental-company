import { LoginForm } from "@/components/login-form";
import CalendarioCitas from "@/components/calendario/CalendarioCitas";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full p-10 gap-8">
      <div className="flex-[3.3] flex items-center justify-end pr-1">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      <div className="flex-[7] flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <CalendarioCitas />
        </div>
      </div>
    </div>
  );
}
