// src/models/products.ts
import { createModel } from "@rematch/core";
import { IRootModel } from ".";

export type TProduct = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
};

export interface IProductsState {
  productList: TProduct[];
  currentPage: number;
}

const INITIAL_STATE: IProductsState = {
  productList: [],
  currentPage: 1,
};

const Product = createModel<IRootModel>()({
  name: "product",
  state: INITIAL_STATE,
  reducers: {
    setProductList(state, payload: IProductsState["productList"]) {
      return {
        ...state,
        productList: payload,
      };
    },
    setCurrentPage(state, payload: number) {
      return {
        ...state,
        currentPage: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async fetchProductList() {
      const response = await fetch(`/api/v1/products`);
      const responseJSON = await response.json();
      dispatch.product.setProductList(responseJSON.data.products);
    },
    async addToCart({ id, quantity }: { id: number; quantity: number }) {
      console.log("TRIGGERED");
      const response = await fetch(`/api/v1/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          product_id: id,
          quantity,
        }),
      });

      const data = await response.json();

      console.log(data);
    },
    async goToPage(page: number) {
      dispatch.product.setCurrentPage(page);
    },
  }),
});

export default Product;
