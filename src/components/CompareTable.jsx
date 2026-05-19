import ProductImage from './ProductImage.jsx';

function getSpecValue(product, specName) {
  return product.specs.find((spec) => spec.name.toLowerCase() === specName.toLowerCase())?.value || '—';
}

function isDifferent(values) {
  return new Set(values.map((value) => String(value).trim().toLowerCase())).size > 1;
}

export default function CompareTable({ products }) {
  const specNames = Array.from(new Set(products.flatMap((product) => product.specs.map((spec) => spec.name))));
  const baseRows = [
    { label: 'Категория', getValue: (product) => product.category || '—' },
    { label: 'Бренд', getValue: (product) => product.brand || '—' },
    { label: 'Цена', getValue: (product) => `${Number(product.price).toLocaleString('ru-RU')} ₽` },
    { label: 'Страна производства', getValue: (product) => product.country || '—' },
  ];

  return (
    <div className="table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Характеристика</th>
            {products.map((product) => (
              <th key={product.id}>
                <div className="compare-product">
                  <ProductImage src={product.image} alt={product.name} />
                  <span>{product.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {baseRows.map((row) => {
            const values = products.map(row.getValue);
            const different = isDifferent(values);

            return (
              <tr key={row.label}>
                <td>{row.label}</td>
                {values.map((value, index) => (
                  <td className={different ? 'cell-diff' : ''} key={`${row.label}-${products[index].id}`}>{value}</td>
                ))}
              </tr>
            );
          })}
          {specNames.map((specName) => {
            const values = products.map((product) => getSpecValue(product, specName));
            const different = isDifferent(values);

            return (
              <tr key={specName}>
                <td>{specName}</td>
                {values.map((value, index) => (
                  <td className={different ? 'cell-diff' : ''} key={`${specName}-${products[index].id}`}>{value}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
