import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import fetch from 'node-fetch';
import { IdentityServiceAdapter } from 'adapters/identity-service.adapter';

export const initAuthMiddleware = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
  };

  const identityAdapter = new IdentityServiceAdapter();

  passport.use(
    'jwt',
    new JwtStrategy(opts, async (payload, req, done) => {
      const { id } = payload;

      const result = await identityAdapter.getUser(id, req.headers.authorization);

      if (findUser) {
        return done(null, findUser);
      } else {
        return done('User does not exist', false);
      }
    }),
  );
}

export const authMiddleware = passport.authenticate('jwt', { session: false });