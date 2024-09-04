import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import i18n from "../../i18n"; // Giả sử bạn đã cấu hình i18n

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/users");
      return data;
    } catch (error) {
      toast.error(
        i18n.t("errorFetchingUsers", "Lỗi khi tải danh sách người dùng")
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      toast.success(
        i18n.t("userDeletedSuccessfully", "Xóa người dùng thành công")
      );
      return id;
    } catch (error) {
      toast.error(i18n.t("errorDeletingUser", "Lỗi khi xóa người dùng"));
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/api/users/${id}`, userData);
      toast.success(
        i18n.t("userUpdatedSuccessfully", "Cập nhật người dùng thành công")
      );
      return data;
    } catch (error) {
      toast.error(i18n.t("errorUpdatingUser", "Lỗi khi cập nhật người dùng"));
      return rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
