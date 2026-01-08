import { useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import api from './utils/api';

const Products = ({}) => {

//=========================================
  const [jwtToken, setJwtToken] = useState("");
  const [products, setProducts] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
      setJwtToken(localStorage.getItem("jwt_token"));
  }, []);

  useEffect(() => {
      if (jwtToken == null) {
          navigate("/");
      }
      if(jwtToken == ""){
        return
      }
      api
          .get(`/products`, {
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
//=========================================
// Delete Product Function
  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if(isConfirmed){
        api
          .delete(`/products/${id}`, {
              headers: {
                  Authorization: "Bearer " + jwtToken,
              },
          })
          .then(()=>{
            setProducts(products.filter(p => p._id !== id))
          })
    }
  }
//=========================================

  const openEdit = (id) => {
    const product = products.find(p => p._id === id);
    navigate("/edit-products", { state: { productData: product } })
  };

  return (
    <div className="products-page">
      {/* Header */}
      <header className="products-header">
        <h1>Products</h1>
        <button onClick={clearToken} className="logout-btn">Logout</button>
        <button onClick={()=>navigate("/add-products")} className="logout-btn">Add Product</button>
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
                <div className="button-group">
                  <button onClick={() => openEdit(product._id)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};
export default Products;