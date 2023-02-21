import { createReducer } from '@reduxjs/toolkit'
import initialBlog from 'constants/iniBlog'
import { Post } from 'types/blogtype'
import { createAction } from '@reduxjs/toolkit'
interface BlogState {
  postList: Post[]
}

const initialState: BlogState = {
  postList: initialBlog
}
export const addPost = createAction<Post>('blog/addPost')

const blogReducer = createReducer(initialState, (builderCallback) => {
  builderCallback.addCase(addPost, (state, action) => {
    state.postList.push(action.payload)
  })
})

export default blogReducer
