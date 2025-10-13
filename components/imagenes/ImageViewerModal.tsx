'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cld } from '@/lib/cloudinary-client';
import { AdvancedImage } from '@cloudinary/react';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { Maximize, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  imageData: {
    id: string;
    public_id: string;
    url: string;
    tipo: string;
    descripcion?: string;
  } | null;
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  onDelete,
  imageData,
}: ImageViewerModalProps) {
  if (!imageData) return null;

  const image = cld.image(imageData.public_id).delivery(quality(auto()));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="capitalize">{imageData.tipo}</DialogTitle>
          <DialogDescription>
            Visualizador de imagen.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center my-4">
          <AdvancedImage cldImg={image} className="max-h-[70vh] w-auto" />
        </div>
        {imageData.descripcion && (
          <p className="text-sm text-muted-foreground mt-2">{imageData.descripcion}</p>
        )}
        <DialogFooter className="sm:justify-between">
          <div>
            <Button variant="ghost" onClick={() => window.open(imageData.url, '_blank')}>
              <Maximize className="mr-2 h-4 w-4" />
              Pantalla Completa
            </Button>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
