import supermarketImg from "./ic_grocery.png";
import cafeImg from "./ic_pizza.png";
import shoppingImg from "./ic_clothes.png";
import transportImg from "./ic_car.png";
import otherImg from "./ic_sell.png";

import supermarketTinkoffImg from "./tink_grocery.png";
import cafeTinkoffImg from "./tink_pizza.png";
import shoppingTinkoffImg from "./tink_clothes.png";
import transportTinkoffImg from "./tink_car.png";
import otherTinkoffImg from "./tink_sell.png";

export type CategoryType = {
  [key: string]: string;
};

export const categoryImgs: CategoryType = {
  supermarket: supermarketImg,
  cafe: cafeImg,
  shopping: shoppingImg,
  transport: transportImg,
  other: otherImg,
};

export const categoryTinkoffImgs: CategoryType = {
  supermarket: supermarketTinkoffImg,
  cafe: cafeTinkoffImg,
  shopping: shoppingTinkoffImg,
  transport: transportTinkoffImg,
  other: otherTinkoffImg,
};

export const categoryTitles: CategoryType = {
  supermarket: "Supermarket",
  cafe: "Cafe",
  shopping: "Shopping",
  transport: "Transport",
  other: "Other",
};
