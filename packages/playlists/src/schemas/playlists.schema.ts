import * as Yup from 'yup';

export const PostPlaylistRequestSchema = Yup.object().shape({
  author: Yup.string().uuid().required(),
  name: Yup.string().min(3).required(),
  private: Yup.bool(),
});
