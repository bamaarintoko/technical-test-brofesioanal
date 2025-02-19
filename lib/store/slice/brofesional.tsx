import { createSlice } from '@reduxjs/toolkit'

const brofesional = createSlice({
    name: 'brofesional',
    initialState: {
        data: {}
    },
    reducers: {
        storeData: (state, action) => { }
    }
})

export const {
    storeData
} = brofesional.actions

export default brofesional.reducer