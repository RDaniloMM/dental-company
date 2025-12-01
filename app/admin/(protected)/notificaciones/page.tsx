import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Bell, Calendar, Cake, PartyPopper } from "lucide-react";
import { SendButton } from "./send-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getClinicDate } from "@/lib/time";

export default async function NotificacionesPage() {
    const supabase = await createClient();

    const { data: patients } = await supabase
        .from("pacientes")
        .select("id, nombres, apellidos, fecha_nacimiento, email")
        .not("fecha_nacimiento", "is", null);

    const today = getClinicDate();
    today.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    const currentYear = today.getFullYear();

    // Helper para calcular la próxima fecha de cumpleaños
    const getNextBirthday = (dateStr: string) => {
        const [, month, day] = dateStr.split("-").map(Number);
        const birthdayThisYear = new Date(currentYear, month - 1, day);
        birthdayThisYear.setHours(0, 0, 0, 0);

        if (birthdayThisYear < today) {
            birthdayThisYear.setFullYear(currentYear + 1);
        }
        return birthdayThisYear;
    };

    interface PatientWithBirthday {
        id: string;
        nombres: string;
        apellidos: string;
        fecha_nacimiento: string;
        email: string;
        nextBirthday: Date;
        diffDays: number;
    }

    const allBirthdays = (patients?.map((p) => {
        if (!p.fecha_nacimiento) return null;
        const nextBirthday = getNextBirthday(p.fecha_nacimiento);
        const diffTime = nextBirthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...p, nextBirthday, diffDays };
    }).filter(Boolean) || []) as PatientWithBirthday[];

    // 1. Cumpleaños de HOY (diffDays === 0)
    const todayBirthdays = allBirthdays.filter((p) => p.diffDays === 0);

    // 2. Próximos 15 días (1 <= diffDays <= 15)
    const upcomingBirthdays = allBirthdays
        .filter((p) => p.diffDays >= 1 && p.diffDays <= 15)
        .sort((a, b) => a.diffDays - b.diffDays);

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold flex items-center gap-2 text-primary">
                    <Bell className="h-8 w-8" />
                    Centro de Notificaciones
                </h1>
                <p className="text-muted-foreground text-lg">
                    Gestiona los saludos de cumpleaños para tus pacientes.
                </p>
            </div>

            {/* SECCIÓN: CUMPLEAÑOS DE HOY */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-pink-600">
                    <PartyPopper className="h-6 w-6" />
                    Cumpleaños de Hoy
                </h2>

                {todayBirthdays.length === 0 ? (
                    <Alert className="bg-muted/50 border-dashed">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <AlertTitle>Sin cumpleaños hoy</AlertTitle>
                        <AlertDescription>
                            No hay pacientes que cumplan años el día de hoy.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {todayBirthdays.map((patient) => (
                            <Card key={patient.id} className="border-pink-200 bg-pink-50/50 hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex justify-between items-start">
                                        <span className="text-lg font-bold text-pink-900">
                                            {patient.nombres} {patient.apellidos}
                                        </span>
                                        <Cake className="h-5 w-5 text-pink-500" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4">
                                        <div className="text-sm text-pink-700">
                                            ¡Está cumpliendo años hoy!
                                        </div>
                                        <SendButton
                                            email={patient.email}
                                            name={patient.nombres}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* SECCIÓN: PRÓXIMOS 15 DÍAS */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
                    <Calendar className="h-6 w-6" />
                    Próximos 15 Días
                </h2>

                <Card>
                    <CardContent className="p-0">
                        {upcomingBirthdays.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No hay cumpleaños registrados para los próximos 15 días.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Paciente</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Días Faltantes</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {upcomingBirthdays.map((patient) => {
                                        const date = patient.nextBirthday;
                                        const day = date.getDate();
                                        const month = date.getMonth() + 1;

                                        return (
                                            <TableRow key={patient.id}>
                                                <TableCell className="font-medium">
                                                    {patient.nombres} {patient.apellidos}
                                                </TableCell>
                                                <TableCell>
                                                    {day}/{month}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        En {patient.diffDays} días
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <SendButton
                                                        email={patient.email}
                                                        name={patient.nombres}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
