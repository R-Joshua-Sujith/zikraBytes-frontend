import { createStore } from "redux"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

let initialState = {
    fileName: "",
    fileData: null
}

const fileReducer = (state = initialState, action) => {
    if (action.type === "name") {
        return {
            ...state,
            fileName: action.fileName,
        }
    } else if (action.type === "data") {
        return {
            ...state,
            fileData: action.fileData
        }
    } else if (action.type === "clear") {
        return {
            fileName: "",
            fileData: null
        }
    }
    else {
        return state;
    }
}

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, fileReducer);


const dataStore = createStore(persistedReducer)

const persistor = persistStore(dataStore)

export { dataStore, persistor }