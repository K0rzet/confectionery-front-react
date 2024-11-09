import { useState, useEffect } from 'react'
import { IProductImage } from '@/types/specification.types'
import styles from './ImagesList.module.scss'
import specificationService from '@/services/specification.service'

interface ImagesListProps {
  images: IProductImage[]
  onUpdate: (images: IProductImage[]) => void
  izdelieId: number
}

export const ImagesList = ({ images = [], onUpdate, izdelieId }: ImagesListProps) => {
  const [uploading, setUploading] = useState(false)
  const SERVER_URL = import.meta.env.VITE_SERVER_URL

  useEffect(() => {
    console.log('Current images:', images)
  }, [images])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tip: 'SKHEMA' | 'FOTO') => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('files', file)
      
      const result = await specificationService.uploadImages(izdelieId, [file])
      console.log('Upload result:', result)

      const fileName = result.izobrazhenia[0].replace('/uploads/izdeliya/', '')
                                         .replace('/uploads/orders/', '')
      
      const newImage: IProductImage = {
        id: Date.now(),
        url: fileName,
        tip,
        izdelieId
      }
      onUpdate([...images, newImage])
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error)
    } finally {
      setUploading(false)
    }
  }

  const getImageUrl = (image: IProductImage) => {
    if (!image.url) return ''
    
    console.log('Processing image URL:', image.url)
    
    if (image.url.startsWith('http')) {
      return image.url
    }
    
    const cleanUrl = image.url
      .replace('/uploads/izdeliya/', '')
      .replace('/uploads/orders/', '')
    
    const fullUrl = `${SERVER_URL}/uploads/orders/${cleanUrl}`
    console.log('Full URL after processing:', fullUrl)
    return fullUrl
  }

  const handleDelete = async (image: IProductImage) => {
    try {
      await specificationService.deleteImages(izdelieId, [image.url])
      onUpdate(images.filter(img => img.id !== image.id))
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error)
    }
  }

  return (
    <div className={styles.images}>
      <h3>Изображения и схемы</h3>
      <div className={styles.uploadButtons}>
        <div className={styles.uploadGroup}>
          <label>Схема изделия:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'SKHEMA')}
            disabled={uploading}
          />
        </div>
        <div className={styles.uploadGroup}>
          <label>Фото образца:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'FOTO')}
            disabled={uploading}
          />
        </div>
      </div>

      <div className={styles.imagesList}>
        {images.map((image) => {
          const imageUrl = getImageUrl(image)
          console.log('Image URL:', imageUrl)
          
          return (
            <div key={image.id} className={styles.imageItem}>
              <img 
                src={imageUrl}
                alt={image.tip === 'SKHEMA' ? 'Схема' : 'Фото'} 
              />
              <div className={styles.imageInfo}>
                <span>{image.tip === 'SKHEMA' ? 'Схема' : 'Фото образца'}</span>
                <button
                  onClick={() => handleDelete(image)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 