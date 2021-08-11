export class CreatePlaylistDto {
  author: string;
  name: string;
  private: boolean;
  tracks: {
    name: string;
    artist: string;
  }[];
}
