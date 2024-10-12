import axios from "axios";
import { DOMAIN } from "./base.api";
import { IFood } from "@/interfaces/interface";

export const getFoodsApi = async (): Promise<IFood[]> => {
  const foods = await axios.get(`${DOMAIN}/food/get-foods`);
  const { data } = foods;
  return data;
};

export const getFoodByIdApi = async (food_id: number): Promise<IFood> => {
  const food = await axios.get(`${DOMAIN}/food/get-food/${food_id}`);
  const { data } = food;
  return data;
};

export const getFoodsByStoreApi = async (): Promise<IFood[]> => {
  const foods = await axios.get(`${DOMAIN}/food/get-foods`);
  const { data } = foods;
  return data;
};

export const getStoresFoodsApi = async () => {
  const storesFoods = await axios.get(`${DOMAIN}/food/get-stores-foods`);
  const { data } = storesFoods;
  return data;
};

export const getStoreFoodByIdApi = async (foodId: number, storeId: number) => {
  const storeFood = await axios.get(
    `${DOMAIN}/food/get-store-food/${foodId}?store_id=${storeId}`
  );
  const { data } = storeFood;
  return data;
};
