import { IsString, IsUUID, IsBoolean } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsUUID()
  author: string;

  @IsString()
  name: string;

  @IsBoolean()
  private: boolean;
}
