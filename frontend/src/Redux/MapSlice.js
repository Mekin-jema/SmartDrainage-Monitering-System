import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  waypoints: [
    { placeName: "", longitude: null, latitude: null },
    { placeName: "", longitude: null, latitude: null },
  ],
  open: false,
  // route: null,
  // map: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setWaypoints: (state, action) => {
      state.waypoints = action.payload;
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    // setRoute: (state, action) => {
    //   state.route = action.payload;
    // },
    // setMap: (state, action) => {
    //   state.map = action.payload;
    // },
  },
});

export const { setWaypoints, setOpen } = mapSlice.actions;

export default mapSlice.reducer;
