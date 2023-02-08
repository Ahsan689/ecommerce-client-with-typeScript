import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { userRequest } from "../requestMethods";
import {useAppSelector} from '../redux/store'


interface State {
  stripeData: any;
  cart: any;
}

interface Product {
  title: string;
  desc: string;
  price: number;
  image: string;
  color: string[];
  size: string[];
}
interface ProductState {
  id:number;
  product:Product;
  quantity: number;
  color: string;
  size: string;
}
interface cartObj {
  products:ProductState[]
  total:number
}

interface StripeData {
  billing_details: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}
const Success = () => {
  
  const location = useLocation();
  //in Cart.jsx I sent data and cart. Please check that page for the changes.(in video it's only data)
  const data:StripeData = (location.state as State).stripeData;
  const cart:cartObj = (location.state as State).cart;

  const currentUser  = useAppSelector((state) => state.user.currentUser) ?? {_id:''}
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        if (currentUser && currentUser._id){
          const res = await userRequest.post("/orders", {
           
            userId: currentUser._id ,
            products: cart.products.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
            amount: cart.total,
            address: data?.billing_details.address,
          });
          setOrderId(res.data._id);

        }
      } catch {}
    };
    data && createOrder();
  }, [cart, data, currentUser]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {orderId
        ? `Order has been created successfully. Your order number is ${orderId}`
        : `Successfull. Your order is being prepared...`}
      <button style={{ padding: 10, marginTop: 20 }}>Go to Homepage</button>
    </div>
  );
};

export default Success;
