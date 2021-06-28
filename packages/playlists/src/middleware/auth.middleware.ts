import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import { IdentityServiceAdapter } from '../adapters/identity-service.adapter';

export const initAuthMiddleware = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
  };

  const identityAdapter = new IdentityServiceAdapter();

  passport.use(
    'jwt',
    // @ts-ignore
    new JwtStrategy(opts, async (req, payload, done) => {
      const { id } = payload;

      try {
        const user = await identityAdapter.getUser(id, req.headers.authorization);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (e) {
        done(null, false);
      }
    }),
  );
};

export const authMiddleware = passport.authenticate('jwt', { session: false });
export const optionalAuthMiddleware = passport.authenticate('jwt', { session: false, failWithError: true });
