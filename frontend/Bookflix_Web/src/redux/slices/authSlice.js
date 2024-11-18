import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  usuario: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    iniciarSesion: (state, action) => {
      const { usuario, token } = action.payload;
      state.usuario = usuario;
      state.token = token;
      localStorage.setItem("token", token);
    },
    cerrarSesion: (state) => {
      state.usuario = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { iniciarSesion, cerrarSesion } = authSlice.actions;

export const selectUsuario = (state) => state.auth.usuario;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
