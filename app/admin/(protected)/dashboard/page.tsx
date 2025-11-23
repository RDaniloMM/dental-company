// import Link from "next/link";
// import { createClient } from "@/lib/supabase/server";
import HomePage from "@/components/HomePage/page";

export default async function Page() {
  // const supabase = await createClient();
  // const { data: patients } = await supabase
  //   .from("pacientes")
  //   .select("id, nombres, apellidos, numero_historia");

  return (
    <>
      <HomePage />
    </>
  );
}
