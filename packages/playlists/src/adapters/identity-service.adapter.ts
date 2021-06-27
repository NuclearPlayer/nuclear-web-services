import fetch from 'node-fetch';

export class IdentityServiceAdapter {
  getUser = async (id: string, authorization: string) =>
    (
      await fetch(`${process.env.identityServiceUrl}/users/${id}`, {
        headers: { authorization },
      })
    ).json();
}
