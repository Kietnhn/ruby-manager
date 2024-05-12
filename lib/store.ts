import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import settingReducer from "@/features/setting-slice";
import productReducer from "@/features/product-slice";
import notificationReducer from "@/features/notification-slice";
const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: number) {
            return Promise.resolve(value);
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

// const settingPersistConfig = {
//     key: "setting",
//     storage: storage,
//     whitelist: ["isShowAsideMenu"],
// };

// const persistedSettingReducer = persistReducer(
//     settingPersistConfig,
//     settingReducer
// );

const rootReducer = combineReducers({
    setting: settingReducer,
    product: productReducer,
    notification: notificationReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
