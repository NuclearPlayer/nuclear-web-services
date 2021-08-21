export type CreatePlaylistDto = {
  author: string;
  name: string;
  private: boolean;
  tracks: {
    name: string;
    artist: string;
  }[];
};

export type UpdatePlaylistDto = Pick<CreatePlaylistDto, 'author'> & Partial<CreatePlaylistDto>;
