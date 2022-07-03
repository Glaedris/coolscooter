import { IsLatitude, IsLongitude } from 'class-validator';

export class SetLocationDto {
  @IsLongitude()
  longitude: number;
  @IsLatitude()
  latitude: number;
}
