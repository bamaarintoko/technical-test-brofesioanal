import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Geo {
    lat: string;
    lng: string;
}

interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}

interface UserState {
    data: User[];
}

const initialState: UserState = {
    data: []
};
const sliceUser = createSlice({
    name: 'sliceUser',
    initialState,
    reducers: {
        storeUser(state, action: PayloadAction<User[]>) {
            const newUsers = action.payload.filter(
                (newUser) => !state.data.some((existingUser) => existingUser.id === newUser.id)
            );
            state.data = [...state.data, ...newUsers];

            console.log('newUsers ', newUsers)
            console.log('action : ', action.payload)
        },
        createUser(state, action) {
            state.data.push(action.payload)
        },
        deleteUser(state, action) {
            state.data = state.data.filter(item => item.id !== action.payload);
        },
        updateUser(state, action) {
            state.data = state.data.map(item =>
                item.id === action.payload.id ? action.payload : item
              );
        }
    }
})

export const { storeUser, createUser, deleteUser, updateUser } = sliceUser.actions
export default sliceUser.reducer 