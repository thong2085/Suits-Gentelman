import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import i18n from "../../i18n";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ category = "" } = {}, { rejectWithValue }) => {
    try {
      let url = "/api/products";
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      toast.error(i18n.t("errorFetchingProducts", "Lỗi khi tải sản phẩm"));
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo?.token}`,
        },
      };
      const { data } = await axiosInstance.get(`/api/products/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (keyword) => {
    const { data } = await axiosInstance.get(
      `/api/products/search?keyword=${keyword}`
    );
    return data;
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/products?category=${encodeURIComponent(category)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    await axiosInstance.delete(`/api/products/${id}`);
    return id;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData) => {
    const { data } = await axiosInstance.post("/api/products", productData);
    toast.success(
      i18n.t("productCreatedSuccessfully", "Tạo sản phẩm thành công")
    );
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const { data } = await axiosInstance.put(
      `/api/products/${id}`,
      productData
    );
    toast.success(
      i18n.t("productUpdatedSuccessfully", "Cập nhật sản phẩm thành công")
    );
    return data;
  }
);

export const addReview = createAsyncThunk(
  "products/addReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/products/${productId}/reviews`,
        { rating, comment }
      );
      toast.success(
        i18n.t("reviewSubmittedSuccessfully", "Đánh giá đã được gửi thành công")
      );
      return response.data;
    } catch (error) {
      if (
        toast.error(
          i18n.t(
            "You have already reviewed this product.",
            "Bạn đã đánh giá sản phẩm này rồi."
          )
        )
      ) {
        return rejectWithValue("You have already reviewed this product.");
      }
      return rejectWithValue(
        toast.error(
          i18n.t(
            "An error occurred while submitting the review.",
            "Đã xảy ra lỗi khi gửi đánh giá."
          )
        )
      );
    }
  }
);

export const getReviews = createAsyncThunk(
  "products/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/products/${productId}/reviews`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const initialState = {
  products: [],
  product: null,
  reviews: [],
  loading: false,
  reviewsLoading: false,
  error: null,
  reviewsError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Product fetch rejected:", action.payload);
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.reviewsError = action.payload;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.payload;
      });
  },
});

export default productSlice.reducer;
