import { createReducer, createSlice } from '@reduxjs/toolkit'
import initialBlog from 'constants/iniBlog'
import { Post } from 'types/blogtype'
import { createAction, PayloadAction } from '@reduxjs/toolkit'
interface BlogState {
  postList: Post[]
  postEdit: Post | null
}

const initialState: BlogState = {
  postList: initialBlog,
  postEdit: null
}
// export const addPost = createAction<Post>('blog/addPost')
// export const removePost = createAction<string>('blog/remove')
// export const startEditPost = createAction<string>('blog/startEdit')
// export const cancelEditPost = createAction('blog/cancelEdit')
// export const finishEditPost = createAction<Post>('blog/finishEdit')

const blogSlice = createSlice({
  name: 'blog',
  initialState: initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.postList.push(action.payload)
    },
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
  }
})

export const { addPost, removePost, startEditPost, cancelEditPost, finishEditPost } = blogSlice.actions

// const blogReducer = createReducer(initialState, (builderCallback) => {
//   builderCallback
//     .addCase(addPost, (state, action) => {
//       state.postList.push(action.payload)
//     })
//     .addCase(removePost, (state, actions) => {
//       const postId = actions.payload
//       const index = state.postList.findIndex((post) => post.id === postId)
//       if (index !== -1) {
//         state.postList.splice(index, 1)
//       }
//     })
//     .addCase(startEditPost, (state, action) => {
//       const id = action.payload
//       const postEdit = state.postList.find((post) => post.id === id) || null
//       state.postEdit = postEdit
//     })
//     .addCase(cancelEditPost, (state) => {
//       state.postEdit = null
//     })
//     .addCase(finishEditPost, (state, action) => {
//       const id = action.payload.id
//       const index = state.postList.findIndex((post) => post.id === id)
//       if (index > -1) {
//         state.postList[index] = action.payload
//       }
//       state.postEdit = null
//     })
// })

const blogReducer = blogSlice.reducer
export default blogReducer
