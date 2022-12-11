import supermarketImg from './ic_grocery.png'
import cafeImg from './ic_pizza.png'
import shoppingImg from './ic_Clothes.png'
import transportImg from './ic_car.png'
import otherImg from './ic_sell.png'


type CategoryType = {
    [key: string]: string
}

export const categoryImgs: CategoryType = {
    supermarket: supermarketImg,
    cafe: cafeImg,
    shopping: shoppingImg,
    transport: transportImg,
    other: otherImg

};

export const categoryTitles: CategoryType = {
    supermarket: 'Supermarket',
    cafe: 'Cafes',
    shopping: 'Shopping',
    transport: 'Transport',
    other: 'Other'
};