import { IsString, IsUUID } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  name: string;

  @IsString()
  @IsUUID()
  addedBy: string;
}

export class PostArtistRequestDto {
  @IsString()
  name: string;
}
