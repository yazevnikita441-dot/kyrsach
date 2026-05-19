import { ImageIcon } from 'lucide-react';

export default function ProductImage({ src, alt }) {
  if (src) {
    return <img className="product-image" src={src} alt={alt} />;
  }

  return (
    <div className="product-placeholder" aria-label="Изображение не загружено">
      <ImageIcon size={34} />
      <span>Нет изображения</span>
    </div>
  );
}
