import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import i18n from "../../i18n";

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/orders", orderData);
      toast.success(i18n.t("orderCreatedSuccessfully", "Đặt hàng thành công"));
      return response.data;
    } catch (error) {
      toast.error(i18n.t("errorCreatingOrder", "Lỗi khi tạo đơn hàng"));
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/orders");
      console.log("Fetched orders:", data);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
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
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/orders/${id}`, { status });
      toast.success(
        i18n.t(
          "orderStatusUpdatedSuccessfully",
          "Cập nhật trạng thái đơn hàng thành công"
        )
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        i18n.t(
          "errorUpdatingOrderStatus",
          "Lỗi khi cập nhật trạng thái đơn hàng"
        )
      );
    }
  }
);

export const payOrder = createAsyncThunk(
  "orders/payOrder",
  async ({ orderId, paymentResult }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/orders/${orderId}/pay`,
        paymentResult
      );
      toast.success(
        i18n.t("orderPaidSuccessfully", "Thanh toán đơn hàng thành công")
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        i18n.t("errorPayingOrder", "Lỗi khi thanh toán đơn hàng")
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/orders/${id}/cancel`);
      toast.success(
        i18n.t("orderCancelledSuccessfully", "Hủy đơn hàng thành công")
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        i18n.t("errorCancellingOrder", "Lỗi khi hủy đơn hàng")
      );
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
        state.error =
          action.payload || i18n.t("errorPlacingOrder", "Lỗi khi đặt hàng");
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
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
      })
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;
