import fetch from 'node-fetch';

export class IdentityServiceAdapter {
  getUser = async (id: string, authorization: string) =>
    (
      await fetch(`${process.env.IDENTITY_SERVICE_URL}/users/${id}`, {
        headers: { authorization },
      })
    ).json();
}
