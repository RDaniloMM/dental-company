import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
// import { InfoIcon } from "lucide-react";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  // ❗ Si NO hay sesión → redirigir a login
  if (!data?.claims) {
    return redirect("/admin/login");
  }

  // 🌟 Si hay sesión, renderiza contenido protegido
  redirect(`/admin/dashboard`);
}
