import { createSlice } from "@reduxjs/toolkit";

//Slice para el control de usuario logeado
const authSlice = createSlice({
  name: "auth",
  initialState: {
    usuario: null,
  },
  reducers: {
    iniciarSesion: (state, action) => {
      state.usuario = action.payload;
    },
    cerrarSesion: (state) => {
      state.usuario = null;
    },
  },
});

export const { iniciarSesion, cerrarSesion } = authSlice.actions;
export default authSlice.reducer;
