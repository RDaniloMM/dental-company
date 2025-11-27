"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function AjustesPage() {
  return (
    <div className='container mx-auto p-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Construction className='h-6 w-6 text-yellow-500' />
            Ajustes de la Aplicación
          </CardTitle>
          <CardDescription>Esta sección está en desarrollo</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Próximamente podrás configurar ajustes generales de la aplicación
            aquí.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
