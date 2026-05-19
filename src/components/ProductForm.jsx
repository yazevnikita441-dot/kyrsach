import { ImagePlus, Plus, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateProduct } from '../utils/validators.js';
import ProductImage from './ProductImage.jsx';

const emptyProduct = {
  name: '',
  category: '',
  brand: '',
  price: '',
  country: '',
  image: '',
  description: '',
  specs: [
    { name: 'Диагональ', value: '' },
    { name: 'Объем памяти', value: '' },
    { name: 'Мощность', value: '' },
    { name: 'Вес', value: '' },
    { name: 'Материал', value: '' },
    { name: 'Гарантия', value: '' },
  ],
};

export default function ProductForm({ initialProduct, onSubmit, submitLabel }) {
  const navigate = useNavigate();
  const initialValue = useMemo(() => ({
    ...emptyProduct,
    ...initialProduct,
    price: initialProduct?.price ?? '',
    specs: initialProduct?.specs?.length ? initialProduct.specs : emptyProduct.specs,
  }), [initialProduct]);

  const [product, setProduct] = useState(initialValue);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setProduct((current) => ({ ...current, [field]: value }));
  }

  function updateSpec(index, field, value) {
    setProduct((current) => ({
      ...current,
      specs: current.specs.map((spec, specIndex) => (
        specIndex === index ? { ...spec, [field]: value } : spec
      )),
    }));
  }

  function addSpec() {
    setProduct((current) => ({
      ...current,
      specs: [...current.specs, { name: '', value: '' }],
    }));
  }

  function removeSpec(index) {
    setProduct((current) => ({
      ...current,
      specs: current.specs.filter((_, specIndex) => specIndex !== index),
    }));
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateField('image', reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProduct(product);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const preparedProduct = {
      ...product,
      name: product.name.trim(),
      category: product.category.trim(),
      brand: product.brand.trim(),
      country: product.country.trim(),
      description: product.description.trim(),
      specs: product.specs
        .map((spec) => ({ name: spec.name.trim(), value: spec.value.trim() }))
        .filter((spec) => spec.name || spec.value),
    };

    onSubmit(preparedProduct);
    navigate('/products');
  }

  return (
    <form className="form product-form" onSubmit={handleSubmit}>
      <section className="form-section">
        <div>
          <h2>Основные данные</h2>
          <p className="muted">Заполните поля, которые будут отображаться в карточке и сравнительной таблице.</p>
        </div>
        <div className="form-grid">
          <label>
            Название товара *
            <input value={product.name} onChange={(event) => updateField('name', event.target.value)} />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>
          <label>
            Категория *
            <input value={product.category} onChange={(event) => updateField('category', event.target.value)} />
            {errors.category && <span className="error">{errors.category}</span>}
          </label>
          <label>
            Бренд
            <input value={product.brand} onChange={(event) => updateField('brand', event.target.value)} />
          </label>
          <label>
            Цена, ₽ *
            <input type="number" min="0" step="1" value={product.price} onChange={(event) => updateField('price', event.target.value)} />
            {errors.price && <span className="error">{errors.price}</span>}
          </label>
          <label>
            Страна производства
            <input value={product.country} onChange={(event) => updateField('country', event.target.value)} />
          </label>
          <label className="form-grid__wide">
            Описание
            <textarea rows="4" value={product.description} onChange={(event) => updateField('description', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="form-section image-section">
        <div>
          <h2>Изображение</h2>
          <p className="muted">Файл будет сохранен в localStorage в формате base64.</p>
        </div>
        <div className="image-uploader">
          <ProductImage src={product.image} alt={product.name || 'Изображение товара'} />
          <label className="button button--ghost file-button">
            <ImagePlus size={16} />
            Загрузить изображение
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <div>
            <h2>Характеристики</h2>
            <p className="muted">Добавьте пары «название — значение» для сравнения товаров.</p>
          </div>
          <button className="button button--ghost" type="button" onClick={addSpec}>
            <Plus size={16} />
            Добавить
          </button>
        </div>

        <div className="spec-editor">
          {product.specs.map((spec, index) => (
            <div className="spec-row" key={`spec-${index}`}>
              <input
                aria-label="Название характеристики"
                placeholder="Название характеристики"
                value={spec.name}
                onChange={(event) => updateSpec(index, 'name', event.target.value)}
              />
              <input
                aria-label="Значение характеристики"
                placeholder="Значение"
                value={spec.value}
                onChange={(event) => updateSpec(index, 'value', event.target.value)}
              />
              <button className="icon-button icon-button--danger" type="button" aria-label="Удалить характеристику" onClick={() => removeSpec(index)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="form-actions">
        <button className="button button--primary" type="submit">
          <Save size={16} />
          {submitLabel}
        </button>
        <button className="button button--ghost" type="button" onClick={() => navigate('/products')}>Отмена</button>
      </div>
    </form>
  );
}
