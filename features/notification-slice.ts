import { IInternalNotification } from "@/lib/definitions";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface INotificationSlice {
    notifications: IInternalNotification[];
    loading: boolean;
    error?: string | null;
}

const initialState: INotificationSlice = {
    notifications: [],
    loading: false,
    error: null,
};

// export const getNotifications = createAsyncThunk(
//     "data/getNotifications",
//     async () => {
//         try {
//             const notification = await getInternalNotifications();

//             return notification;
//         } catch (error) {
//             // If an error occurs during the fetch operation, throw it
//             throw error;
//         }
//     }
// );
const notificationSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        setNotifications: (
            state,
            action: PayloadAction<IInternalNotification[]>
        ) => {
            state.notifications = action.payload;
        },
        addNotification: (
            state,
            action: PayloadAction<IInternalNotification>
        ) => {
            state.notifications.push(action.payload);
        },
    },
    // extraReducers: (builder) => {
    //     // Add reducers to handle pending, fulfilled, and rejected states of fetchDataAsync
    //     builder
    //         .addCase(getNotifications.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(getNotifications.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.notifications = action.payload;
    //         })
    //         .addCase(getNotifications.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.error.message;
    //         });
    // },
});
export const { setNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
