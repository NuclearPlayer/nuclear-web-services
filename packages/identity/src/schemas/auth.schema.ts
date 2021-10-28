// @ts-ignore
import { list } from 'the-big-username-blacklist';
import * as Yup from 'yup';

export const SignUpRequestSchema = Yup.object().shape({
  username: Yup.string().min(4).required().notOneOf(list, 'this username is reserved'),
  email: Yup.string().email(),
  password: Yup.string().min(6).required(),
});
