import * as Yup from 'yup';

const TrackSchema = Yup.object().shape({
  artist: Yup.string().min(3).required(),
  name: Yup.string().required(),
});

export const PostPlaylistRequestSchema = Yup.object().shape({
  name: Yup.string().min(3).required(),
  tracks: Yup.array().of(TrackSchema),
  private: Yup.bool(),
});

export const PutPlaylistRequestSchema = Yup.object().shape({
  name: Yup.string().min(3),
  tracks: Yup.array().of(TrackSchema),
  private: Yup.bool(),
});
