import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import { combineReducers } from "redux";
import mapReducer from "./MapSlice";

// Configuration for Redux Persist
const persistConfig = {
  key: "root", // Key for storage
  storage, // Specify the storage engine
};

// Combine reducers (useful if you have more than one reducer)
const rootReducer = combineReducers({
  map: mapReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Create a persistor
export const persistor = persistStore(store);
