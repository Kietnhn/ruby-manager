import { ICart } from "@/lib/definitions";
import { PaymentMethods } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
type Step = "order" | "discount" | "payment" | "review";
interface IOrderSlice {
    cart: ICart[];
    // steps: Step[];
    paymentMethod: PaymentMethods | null;
    currentStep: number;
}

const initialState: IOrderSlice = {
    cart: [],
    currentStep: 0,
    paymentMethod: null,
};
const orderSlice = createSlice({
    name: "order",
    initialState: initialState,
    reducers: {
        setCart: (state, action: PayloadAction<ICart[]>) => {
            state.cart = action.payload;
        },
        addToCart: (state, action: PayloadAction<ICart>) => {
            const cart = [...state.cart];
            const existedVariation = cart.find(
                (item) => item.variationId === action.payload.variationId
            );
            if (existedVariation) {
                const newCart = cart.map((item) =>
                    item.variationId === existedVariation.variationId
                        ? { ...item, quantity: existedVariation.quantity + 1 }
                        : item
                );
                state.cart = newCart;
            } else {
                state.cart.push(action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<ICart>) => {
            state.cart.filter(
                (item) => item.productId !== action.payload.productId
            );
        },
        setPaymentMethod: (
            state,
            action: PayloadAction<PaymentMethods | null>
        ) => {
            state.paymentMethod = action.payload;
        },
        setCurrentStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
    },
});
export const {
    addToCart,
    removeFromCart,
    setCart,
    setCurrentStep,
    setPaymentMethod,
} = orderSlice.actions;
export default orderSlice.reducer;
