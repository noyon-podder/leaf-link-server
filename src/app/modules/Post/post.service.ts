import { QueryBuilder } from '../../builder/QueryBuilder'
import { TImageFiles } from '../../interface/image.interface'
import { PostsSearchableFields } from './post.constant'
import { IPost } from './post.interface'
import { Post } from './post.model'

// CREATE A NEW POST
const createPost = async (payload: IPost, images: TImageFiles) => {
  const { postImages } = images

  payload.images = postImages.map((image) => image.path)

  const result = await Post.create(payload)

  return result
}

// GET ALL POST WITH SEARCH
const getAllPost = async (query: Record<string, unknown>) => {
  const itemQuery = new QueryBuilder(Post.find().populate('author'), query)
    .filter()
    .search(PostsSearchableFields)
    .sort()
    .paginate()
    .fields()

  const result = await itemQuery.modelQuery

  return result
}

export const PostService = {
  createPost,
  getAllPost,
}
