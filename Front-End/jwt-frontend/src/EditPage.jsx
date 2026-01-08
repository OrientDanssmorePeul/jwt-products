import { useState, useEffect, useRef} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from './utils/api';
import { 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Box 
} from '@mui/material';

const EditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // The "?" prevents app from crashing if user directly type to '/edit-product'   
  const currentProduct = location.state?.productData;

  const [jwtToken, setJwtToken] = useState("");
  useEffect(() => {
      setJwtToken(localStorage.getItem("jwt_token"));
      if(!currentProduct){
        navigate("/products")
      }
  }, []);

  const nameRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();
  const categoryRef = useRef();
  const imageRef = useRef();
  const stockRef = useRef();

  const handleSave = () => {
    api
      .patch(`/products/${currentProduct._id}`, 
        {
          name: nameRef.current.value,
          description: descRef.current.value,
          price: Number(priceRef.current.value),
          category: categoryRef.current.value,
          inStock: stockRef.current.checked,
          imageUrl: imageRef.current.value
        },
        {headers: {Authorization: `Bearer ${jwtToken}`,}}
      )
      .then(()=>{
          navigate("/products")
      })
  }
  if(!currentProduct) return
  return(
    <>
      <div className="overlay">
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
          <Button onClick={()=>navigate("/products")} style={{ marginTop: "20px" }}>Close</Button>
        </div>
      </div>
    </>
  )
}

export default EditProduct