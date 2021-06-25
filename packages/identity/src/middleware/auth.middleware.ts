import { HttpException } from '@nws/core';
import { omit } from 'lodash';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { UserService } from '../services/users.service';

export const initAuthMiddleware = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    'jwt',
    new JwtStrategy(opts, async (payload, done) => {
      const { id } = payload;
      const findUser = await new UserService().findOneById(id);
      if (findUser) {
        return done(null, findUser);
      } else {
        return done(null, false);
      }
    }),
  );

  passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { email } = req.body;
          const user = await new UserService().create({ email, username, password });

          return done(null, omit(user.toJSON(), 'password'));
        } catch (error) {
          done(error);
        }
      },
    ),
  );

  passport.use(
    'signin',
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await new UserService().findOneByUsername(username);

        const hasValidPassword = user && (await bcrypt.compare(password, user.password));

        if (user && hasValidPassword) {
          return done(null, omit(user.toJSON(), 'password'));
        } else {
          throw new HttpException(401, 'Incorrect username or password');
        }
      } catch (error) {
        done(error);
      }
    }),
  );
};

export const authMiddleware = passport.authenticate('jwt', { session: false });

export const signUpMiddleware = passport.authenticate('signup', { session: false });

export const signInMiddleware = passport.authenticate('signin', { session: false });
