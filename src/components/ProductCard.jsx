import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage.jsx';

export default function ProductCard({
  product,
  selected,
  compareDisabled,
  onToggleCompare,
  onDelete,
}) {
  return (
    <article className={`product-card ${selected ? 'product-card--selected' : ''}`}>
      <div className="product-card__media">
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <div className="product-card__body">
        <div className="product-card__top">
          <span className="badge">{product.category}</span>
          <strong>{Number(product.price).toLocaleString('ru-RU')} ₽</strong>
        </div>
        <h3>{product.name}</h3>
        <p className="muted">{product.brand || 'Бренд не указан'} · {product.country || 'Страна не указана'}</p>
        <p>{product.description || 'Описание не добавлено.'}</p>
        <div className="spec-preview">
          {product.specs.slice(0, 3).map((spec) => (
            <span key={`${product.id}-${spec.name}`}>{spec.name}: {spec.value}</span>
          ))}
        </div>
      </div>
      <div className="product-card__actions">
        <button
          className={`button ${selected ? 'button--success' : 'button--ghost'}`}
          type="button"
          onClick={() => onToggleCompare(product.id)}
          disabled={!selected && compareDisabled}
        >
          {selected ? <Check size={16} /> : <Plus size={16} />}
          {selected ? 'Выбрано' : 'Сравнить'}
        </button>
        <Link className="button button--ghost" to={`/products/edit/${product.id}`}>
          <Pencil size={16} />
          Изменить
        </Link>
        <button className="button button--danger" type="button" onClick={() => onDelete(product.id)}>
          <Trash2 size={16} />
          Удалить
        </button>
        {compareDisabled && !selected && <span className="help-line"><X size={14} />Можно выбрать до 3 товаров</span>}
      </div>
    </article>
  );
}
