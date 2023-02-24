import PostItem from '../PostItem'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'store'
import { deletePost, getPostList, startEditPost } from 'pages/blog/blog.slice'
import { Fragment, useEffect } from 'react'
import SkeletonLoading from '../SkeletonLoading'
export default function PostList() {
  const postList = useSelector((state: RootState) => state.blog.postList)
  const dispatch = useAppDispatch()
  const loading = useSelector((state: RootState) => state.blog.loading)

  // get API
  useEffect(() => {
    const promise = dispatch(getPostList())
    return () => {
      promise.abort()
    }
  }, [dispatch])
  const handleRemove = (index: string) => {
    dispatch(deletePost(index))
  }
  const handleStartEditPost = (id: string) => {
    dispatch(startEditPost(id))
  }
  return (
    <div className='bg-white py-6 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
        <div className='mb-10 md:mb-16'>
          <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Được Dev Blog</h2>
          <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
            Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
          </p>
        </div>
        {loading && (
          <Fragment>
            <SkeletonLoading />
          </Fragment>
        )}

        {!loading && (
          <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
            {postList.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                handleRemove={handleRemove}
                handleStartEditPost={handleStartEditPost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
