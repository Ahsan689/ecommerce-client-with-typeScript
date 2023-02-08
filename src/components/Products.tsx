import { useEffect, useState } from "react";
import styled from "styled-components";
import { popularProducts } from "../data";
import Product from "./Product";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

interface ProductObj {
  id:number;
  title: string;
  desc: string;
  price: number;
  image: string;
  color: string[];
  size: string[];
  createdAt:any;
}

interface ProductState {
  product:ProductObj;
  quantity: number;
  color: string;
  size: string;
}
type ProductKey = keyof ProductObj;

// interface item  { id: number, image: string }
const Products = ({ cat = "", filters = {}, sort = "" }:{ cat?: string, filters?: any, sort?: any }) => {
  const [products, setProducts] = useState<ProductObj[]>([]);
  const [quantity, setQuantity] = useState<ProductState["quantity"]>(1);
  const [color, setColor] = useState<ProductState["color"]>("");
  const [size, setSize] = useState<ProductState["size"]>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductObj[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          cat
            ? `http://localhost:5000/api/products?category=${cat}`
            // : "http://localhost:5000/api/products"
            : "https://fakestoreapi.com/products"
        );
        setProducts(res.data);
      } catch (err) {}
    };
    getProducts();
  }, [cat]);

  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]:[string, any]) =>{
            if (key in item) {
              const prop = item[key as ProductKey];
              if (Array.isArray(prop)) {
                return prop.some(item => item.includes(value));
              } else {
                return typeof prop === "string" && prop.includes(value);
              }
              
            }
            return false
           
          }
          //  item[key].includes(value)
         
        ))
      );
  }, [products, cat, filters]);

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Container>
      {cat
        ? filteredProducts.map((item) => <Product item={item} key={item.id} />)
        : products
            .slice(0, 8)
            .map((item) => <Product item={{ id: item.id, image: item.image }} key={item.id} />)}
    </Container>
  );
};

export default Products;
