import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import i18n from "../../i18n";
import { toast } from "react-toastify";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/users/login",
        credentials
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success(i18n.t("loginSuccessfully", "Đăng nhập thành công"));
      return data;
    } catch (error) {
      toast.error(i18n.t("errorLoggingIn", "Lỗi khi đăng nhập"));
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/users/register",
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success(i18n.t("registerSuccessfully", "Đăng ký thành công"));
      return data;
    } catch (error) {
      toast.error(i18n.t("errorRegistering", "Lỗi khi đăng ký"));
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put("/api/users/profile", userData);
      localStorage.setItem("userInfo", JSON.stringify(data));
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

export const logout = createAsyncThunk("auth/logout", async () => {
  toast.success(i18n.t("logoutSuccessfully", "Đăng xuất thành công"));
  localStorage.removeItem("userInfo");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export default authSlice.reducer;
