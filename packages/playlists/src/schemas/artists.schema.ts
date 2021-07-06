import * as Yup from 'yup';

export const PostArtistRequestSchema = Yup.object().shape({
  name: Yup.string().required(),
});
