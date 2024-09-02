import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/orders", orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/orders");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    order: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
