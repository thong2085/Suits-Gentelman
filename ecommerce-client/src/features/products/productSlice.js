import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ category = "", page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      let url = "/api/products";
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const response = await axiosInstance.get(url, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Product already reviewed"
      ) {
        return rejectWithValue("You have already reviewed this product.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while submitting the review."
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
  totalProducts: 0,
  page: 1,
  pages: 1,
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
        state.totalProducts = action.payload.totalProducts;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
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
