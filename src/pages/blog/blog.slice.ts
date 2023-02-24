import { createAsyncThunk, createSlice, current, AsyncThunk } from '@reduxjs/toolkit'
import { Post } from 'types/blogtype'
import { PayloadAction } from '@reduxjs/toolkit'
import http from 'utils/http'
interface BlogState {
  postList: Post[]
  postEdit: Post | null
  loading: boolean
  currentRequestId: string | undefined
}

const initialState: BlogState = {
  postList: [],
  postEdit: null,
  loading: false,
  currentRequestId: undefined
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
  const res = await http.get<Post[]>('posts', {
    signal: thunkAPI.signal
  })
  return res.data
})

export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
  const res = await http.post<Post>('posts', body, {
    signal: thunkAPI.signal
  })
  return res.data
})

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    const res = await http.put<Post>(`posts/${postId}`, body, {
      signal: thunkAPI.signal
    })
    return res.data
  }
)

export const deletePost = createAsyncThunk('blog/deletePost', async (postId: string, thunkAPI) => {
  // tại sao response van la Post
  const res = await http.delete<Post>(`posts/${postId}`, {
    signal: thunkAPI.signal
  })
  return res.data
})

export const blogSlice = createSlice({
  name: 'blog',
  initialState: initialState,
  reducers: {
    removePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      const index = state.postList.findIndex((post) => post.id === postId)
      if (index !== -1) {
        state.postList.splice(index, 1)
      }
    },
    startEditPost: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const postEdit = state.postList.find((post) => post.id === id) || null
      state.postEdit = postEdit
    },
    cancelEditPost: (state) => {
      state.postEdit = null
    },
    finishEditPost: (state, action: PayloadAction<Post>) => {
      const id = action.payload.id
      const index = state.postList.findIndex((post) => post.id === id)
      if (index > -1) {
        state.postList[index] = action.payload
      }
      state.postEdit = null
    }
  },
  extraReducers(builderCallback) {
    builderCallback
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const id = action.payload.id
        state.postList.find((post, index) => {
          if (post.id === id) {
            state.postList[index] = action.payload
            return true
          }
          return false
        })
        state.postEdit = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const index = state.postList.findIndex((post) => post.id === action.meta.arg)
        if (index > -1) {
          state.postList.splice(index, 1)
        }
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('pending'),
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith('rejected'),
        (state, action) => {
          if (state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith('fulfilled'),
        (state, action) => {
          if (state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
  }
})

export const { removePost, startEditPost, cancelEditPost, finishEditPost } = blogSlice.actions

const blogReducer = blogSlice.reducer
export default blogReducer
