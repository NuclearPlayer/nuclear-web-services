import fetch from 'node-fetch';

export class IdentityServiceAdapter {
  getUser = (id: string, authorization: string) =>
    fetch(`${process.env.identityServiceUrl}/users/${id}`, {
      headers: { authorization },
    });
}
