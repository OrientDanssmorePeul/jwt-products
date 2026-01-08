import { useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import api from './utils/api';
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

const AddProduct = () => {

  const [jwtToken, setJwtToken] = useState("");
  useEffect(() => {
      setJwtToken(localStorage.getItem("jwt_token"));
  }, []);

  const navigate = useNavigate();

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
      api
        .post(``, 
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
        .then(()=>{
          navigate("/products")
        })
  }
  return(
    <>
      <div className="overlay">
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
          <Button onClick={()=>navigate("/products")} style={{ marginTop: "20px" }}>Close</Button>
        </div>
      </div>
    </>
  )
}

export default AddProduct