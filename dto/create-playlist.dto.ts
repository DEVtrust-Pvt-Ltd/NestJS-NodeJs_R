import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiProperty() @IsNotEmpty() @IsString() description: string;
  @ApiProperty() @IsNotEmpty() @IsString() slug: string;

  @ApiProperty({ name: 'cover', type: 'file', required: true })
  public readonly cover: any;

  @Transform(value => (Number.isNaN(+value) ? 0 : +value))
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  category_id: number;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @Transform((value: string) => value.split(','))
  tags: string[];

  @Transform(value => (value === 'true' ? true : false))
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_enabled: boolean;

  @Transform(value => (value === 'true' ? true : false))
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_deleted: boolean;

  public static from(dto: Partial<CreatePlaylistDto>) {
    const it = new CreatePlaylistDto();
    it.name = dto.name;
    it.description = dto.description;
    it.slug = dto.slug;
    it.category_id = dto.category_id;
    it.is_enabled = dto.is_enabled;
    it.is_deleted = dto.is_deleted;
    it.tags = dto.tags;
    return it;
  }
}
