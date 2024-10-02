import { TImageFiles } from '../../interface/image.interface'
import { IPost } from './post.interface'
import { Post } from './post.model'

const createPost = async (payload: IPost, images: TImageFiles) => {
  const { postImages } = images

  payload.images = postImages.map((image) => image.path)

  const result = await Post.create(payload)

  return result
}

export const PostService = {
  createPost,
}
