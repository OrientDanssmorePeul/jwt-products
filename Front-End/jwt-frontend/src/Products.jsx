import { useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Box 
} from '@mui/material';
import axios from 'axios';

const Products = () => {

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
      axios
          .get(`${import.meta.env.VITE_API_URL}/products`, {
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
        axios
          .delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
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
  const [toggleAdd, setToggleAdd] = useState(false)
  const [toggleEdit, setToggleEdit] = useState(false)
  const [currentProduct, setCurrentProduct] = useState()

  const openEdit = (id) => {
    const product = products.find(p => p._id === id);
    setCurrentProduct(product);
    setToggleEdit(true);
  };

  return (
    <div className="products-page">
      <AddProduct toggle={toggleAdd} setToggle={setToggleAdd} jwtToken={jwtToken} setProducts={setProducts}/>
      <EditProduct toggle={toggleEdit} currentProduct={currentProduct} jwtToken={jwtToken} setToggleEdit={setToggleEdit} setProducts={setProducts}/>
      {/* Header */}
      <header className="products-header">
        <h1>Products</h1>
        <button onClick={clearToken} className="logout-btn">Logout</button>
        <button onClick={()=>toggleAdd?setToggleAdd(false):setToggleAdd(true)} className="logout-btn">Add Product</button>
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
                <div>
                  <button onClick={()=>openEdit(product._id)} style={{marginTop: "10px"}}>Edit</button>
                  <button onClick={()=>handleDelete(product._id)} style={{marginTop: "10px", marginLeft: "10px"}}>Delete</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

//=========================================
// Add Product Modal
const AddProduct = ({toggle, setToggle, jwtToken, setProducts}) => {

  const nameRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();
  const categoryRef = useRef();
  const imageRef = useRef();
  const stockRef = useRef();

  const handleAdd = () => {
  if (!nameRef.current?.value || !priceRef.current?.value || !categoryRef.current?.value) {
    alert("Please fill in all required fields (Name, Price, and Category)");
    return
  }
      axios
        .post(`${import.meta.env.VITE_API_URL}`, 
          {
            name: nameRef.current.value,
            description: descRef.current.value,
            price: Number(priceRef.current.value),
            category: categoryRef.current.value,
            inStock: stockRef.current.checked,
            imageUrl: imageRef.current.value
          },
          {headers: {Authorization: "Bearer " + jwtToken,}}
        )
        .then((response)=>{
          setToggle(false)
          setProducts(response.data)
        })
  }
  return(
    <>
      <div className="overlay" style={{display: toggle ? 'flex' : 'none'}}>
        <div className="content">
          <h2>Add New Product</h2>          
          <Box>
            <TextField inputRef={nameRef} sx={{marginTop: "5px"}} label="Product Name" name="name" required fullWidth/>
            <TextField inputRef={descRef} sx={{marginTop: "5px"}} label="Description" name="description" multiline rows={4} fullWidth/>
            <TextField inputRef={priceRef} sx={{marginTop: "5px"}} label="Price" name="price" type="number" required fullWidth/>

            <FormControl fullWidth sx={{ marginTop: "5px" }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                label="Category"
                defaultValue="" 
                inputProps={{ ref: categoryRef }}
              >
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="home">Home & Garden</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel control={<Checkbox inputRef={stockRef}  name="inStock"/>} label="In Stock"/>
            <TextField inputRef={imageRef} label="Image URL" name="imageUrl" fullWidth/>
            <Button onClick={handleAdd} variant="contained" type="submit" sx={{ mt: 2 }}>
              Save Product
            </Button>      
          </Box>
          <Button onClick={()=>toggle?setToggle(false):setToggle(true)} style={{ marginTop: "20px" }}>Close</Button>
        </div>
      </div>
    </>
  )
}
//=========================================
// Edit Product Modal

const EditProduct = ({toggle, currentProduct, jwtToken, setToggleEdit, setProducts}) => {

  const nameRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();
  const categoryRef = useRef();
  const imageRef = useRef();
  const stockRef = useRef();

  const handleSave = () => {
    axios
      .patch(`${import.meta.env.VITE_API_URL}/products/${currentProduct._id}`, 
        {
          name: nameRef.current.value,
          description: descRef.current.value,
          price: Number(priceRef.current.value),
          category: categoryRef.current.value,
          inStock: stockRef.current.checked,
          imageUrl: imageRef.current.value
        },
        {headers: {Authorization: "Bearer " + jwtToken,}}
      )
      .then((response)=>{
        setToggleEdit(false)
        setProducts(response.data)
      })
  }
  if(!currentProduct) return
  return(
    <>
      <div className="overlay" style={{display: toggle ? 'flex' : 'none'}}>
        <div className="content">
          <h2>Add New Product</h2>          
          <Box key={currentProduct._id}>
            <TextField defaultValue={currentProduct.name} inputRef={nameRef} sx={{marginTop: "10px"}} label="Product Name" name="name" required fullWidth/>
            <TextField defaultValue={currentProduct.description} inputRef={descRef} sx={{marginTop: "10px"}} label="Description" name="description" multiline rows={4} fullWidth/>
            <TextField defaultValue={currentProduct.price} inputRef={priceRef} sx={{marginTop: "10px"}} label="Price" name="price" type="number" required fullWidth/>
            <TextField defaultValue={currentProduct.category} inputRef={categoryRef} sx={{marginTop: "10px"}} label="Category Name" name="category" required fullWidth/>

            <FormControlLabel control={<Checkbox defaultChecked={currentProduct.inStock} inputRef={stockRef}  name="inStock"/>} label="In Stock"/>
            <TextField defaultValue={currentProduct.imageUrl} inputRef={imageRef} label="Image URL" name="imageUrl" fullWidth/>
            <Button onClick={handleSave} variant="contained" type="submit" sx={{ mt: 2 }}>
              Save Product
            </Button>      
          </Box>
          <Button onClick={()=>toggle?setToggleEdit(false):setToggleEdit(true)} style={{ marginTop: "20px" }}>Close</Button>
        </div>
      </div>
    </>
  )
}
//=========================================
export default Products;