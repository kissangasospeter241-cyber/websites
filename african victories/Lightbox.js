import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Lightbox.module.css'

export default function Lightbox({ images = [], start = 0, onClose }) {
  const [index, setIndex] = useState(start)

  useEffect(() => {
    setIndex(start)
  }, [start])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((prev) => (prev + 1) % images.length)
      if (e.key === 'ArrowLeft') setIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  if (!images || images.length === 0) return null
  const img = images[index]

  function nextImage(e) {
    e.stopPropagation()
    setIndex((prev) => (prev + 1) % images.length)
  }

  function prevImage(e) {
    e.stopPropagation()
    setIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close gallery">x</button>
        <button type="button" className={styles.arrowLeft} onClick={prevImage} aria-label="Previous image">&lt;</button>
        <div className={styles.imageWrap}>
          <Image src={img.url} alt={img.alt || ''} fill className={styles.image} />
        </div>
        <button type="button" className={styles.arrowRight} onClick={nextImage} aria-label="Next image">&gt;</button>
        <div className={styles.counter}>{index + 1} / {images.length}</div>
      </div>
    </div>
  )
}
