'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cld } from '@/lib/cloudinary-client'
import { AdvancedImage } from '@cloudinary/react'
import { thumbnail } from '@cloudinary/url-gen/actions/resize'
import { format } from 'date-fns'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageCardProps {
  imageData: {
    id: string
    public_id: string
    tipo: string
    fecha_subida: string
    url: string
  }
  onClick: () => void
}

export default function ImageCard ({ imageData, onClick }: ImageCardProps) {
  const { public_id, tipo, fecha_subida, url } = imageData

  const image = cld
    .image(public_id)
    .resize(thumbnail().width(300).height(300).gravity('auto'))

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', `${public_id}.jpg`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error al descargar la imagen:', error)
    }
  }

  return (
    <Card
      onClick={onClick}
      className='cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105'
    >
      <CardContent className='p-0'>
        <div className='relative group'>
          <AdvancedImage
            cldImg={image}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300' />
          <div className='absolute top-2 right-2'>
            <Button
              size='icon'
              variant='ghost'
              className='text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
              onClick={handleDownload}
            >
              <Download className='h-5 w-5' />
            </Button>
          </div>
          <div className='absolute bottom-2 left-2 flex flex-col items-start'>
            <Badge variant='secondary' className='mb-1'>
              {tipo}
            </Badge>
            <Badge variant='secondary'>
              {format(new Date(fecha_subida), 'dd/MM/yyyy')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
