import { configureStore } from "@reduxjs/toolkit";
import infoSlice from "./infoSlice";
import productSlice from "./productSlice";
import likeSlice from "./likeSlice";
import basketSlice from "./basketSlice";
import filterSlice from "./filterSlice";

const backendSyncMiddleware = store => next => action => {
  const result = next(action);
  try {
    const userStr = localStorage.getItem("userData");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.id) {
        if (action.type === "basket/addToBasket") {
          fetch("http://localhost:3000/carts/createCart", {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ user_id: user.id, card_id: action.payload.id })
          }).catch(()=>{});
        }
        if (action.type === "like/addLike") {
          fetch("http://localhost:3000/likes/createLike", {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ user_id: user.id, product_id: action.payload.id })
          }).catch(()=>{});
        }
      }
    }
  } catch (e) {}
  return result;
};

export const store = configureStore({
  reducer: {
    info: infoSlice,
    product: productSlice,
    like: likeSlice,
    basket: basketSlice,
    filter: filterSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(backendSyncMiddleware),
});
