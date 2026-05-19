import ProductForm from '../components/ProductForm.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function ProductNewPage() {
  const { addProduct } = useProducts();

  return (
    <div className="page page--narrow">
      <section className="page-head">
        <div>
          <span className="eyebrow">Новый товар</span>
          <h1>Добавление карточки товара</h1>
          <p>Создайте запись с изображением, описанием и характеристиками для сравнения.</p>
        </div>
      </section>
      <ProductForm onSubmit={addProduct} submitLabel="Сохранить товар" />
    </div>
  );
}
