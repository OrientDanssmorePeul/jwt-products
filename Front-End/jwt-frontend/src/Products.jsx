const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    description: "Smooth and responsive wireless mouse",
    price: "$25.99",
    category: "Electronics",
    inStock: true,
    image: "data:image/png;base64,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",
  },
  {
    id: 2,
    name: "Notebook",
    description: "Hardcover notebook for daily notes",
    price: "$7.50",
    category: "Stationery",
    inStock: false,
    image: "",
  },
];

const Products = () => {
  return (
    <div className="products-page">
      {/* Header */}
      <header className="products-header">
        <h1>Products</h1>
        <button className="logout-btn">Logout</button>
      </header>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="no-image">No Image</div>
            )}

            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="description">{product.description}</p>

              <div className="meta">
                <span className="price">{product.price}</span>
                <span className="category">{product.category}</span>
              </div>

              <span
                className={
                  product.inStock ? "stock in-stock" : "stock out-stock"
                }
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;