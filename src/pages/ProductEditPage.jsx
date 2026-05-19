import { Navigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function ProductEditPage() {
  const { id } = useParams();
  const { getProduct, updateProduct } = useProducts();
  const product = getProduct(id);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="page page--narrow">
      <section className="page-head">
        <div>
          <span className="eyebrow">Редактирование</span>
          <h1>{product.name}</h1>
          <p>Измените данные товара, характеристики или изображение.</p>
        </div>
      </section>
      <ProductForm initialProduct={product} onSubmit={(data) => updateProduct(id, data)} submitLabel="Обновить товар" />
    </div>
  );
}
