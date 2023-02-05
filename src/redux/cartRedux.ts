import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface Product {
  title: string;
  desc: string;
  price: number;
  image: string;
  color: string[];
  size: string[];
}

interface ProductState {
  product:Product;
  quantity: number;
  color: string;
  size: string;
}
interface CartState {
  products: ProductState[];
  total: number;
  t_quantity: number;
}

const initialState: CartState = {
  products: [],
  total: 0,
  t_quantity: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action:PayloadAction<ProductState>) => {
      let { product, quantity, color, size } = action.payload;
      console.log(quantity, state.t_quantity,"qnty")
      state.t_quantity += 1;
      state.products.push({ product, quantity, color, size });
      state.total += product.price * action.payload.quantity;
    },
    clearCartProducts: (state, action:PayloadAction<ProductState>) => {
      // let { product, quantity, color, size } = action.payload;
      // console.log(quantity, state.t_quantity,"qnty")
      state.t_quantity = 0;
      state.products = []
      state.total = 0 ;
    },
  },
});

export const { addProduct, clearCartProducts } = cartSlice.actions;
export default cartSlice.reducer;
