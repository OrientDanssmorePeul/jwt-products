import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Products = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [products, setProducts] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
      setJwtToken(localStorage.getItem("jwt_token"));
  }, []);

  useEffect(() => {
      if (jwtToken == null || jwtToken == "") {
          navigate("/");
      }
      axios
          .get("http://localhost:3000/products", {
              headers: {
                  Authorization: "Bearer " + jwtToken,
              },
          })
          .then((response) => {
              setProducts(response.data)
          })
          .catch((error) => {
              console.log(error);
              if(error.status === 403)
                  clearToken()
          });
  }, [jwtToken]);

  const clearToken = () => {
      localStorage.clear();
      navigate("/");
  };

  return (
    <div className="products-page">
      {/* Header */}
      <header className="products-header">
        <h1>Products</h1>
        <button onClick={clearToken} className="logout-btn">Logout</button>
      </header>

      {/* Products Grid */}
      <div className="products-grid">
        {
          products.map((product) => (
            <div key={product._id} className="product-card">
              {
                product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )
              }

              <div className="product-info">
                <h2>{product.name}</h2>
                <p className="description">{product.description}</p>

                <div className="meta">
                  <span className="price">{product.price}</span>
                  <span className="category">{product.category}</span>
                </div>

                <span className={product.inStock ? "stock in-stock" : "stock out-stock"}>
                  {
                    product.inStock ? "In Stock" : "Out of Stock"
                  }
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Products;