import { TGallery } from "@/lib/definitions";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface IProduct {
    gallery: TGallery[];
    isShowWarning: boolean;
}

const initialState: IProduct = {
    gallery: [],
    isShowWarning: true,
};
const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: {
        setGallery: (state, action: PayloadAction<TGallery[]>) => {
            state.gallery = action.payload;
        },
        addGallery: (state, action: PayloadAction<TGallery>) => {
            state.gallery.push(action.payload);
        },
        setIsShowWarning: (state, action: PayloadAction<boolean>) => {
            state.isShowWarning = action.payload;
        },
    },
});
export const { setGallery, addGallery, setIsShowWarning } =
    productSlice.actions;
export default productSlice.reducer;
