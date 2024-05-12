import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ISettings {
    isShowAsideMenu: boolean;
}

const initialState: ISettings = {
    isShowAsideMenu: false,
};
const settingSlice = createSlice({
    name: "setting",
    initialState: initialState,
    reducers: {
        setIsShowAsideMenu: (state, action: PayloadAction<boolean>) => {
            state.isShowAsideMenu = action.payload;
        },
    },
});
export const { setIsShowAsideMenu } = settingSlice.actions;
export default settingSlice.reducer;
