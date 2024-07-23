import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PlaylistCategoriesService } from '../playlist-categories/playlist-categories.service';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepo: Repository<Playlist>,
    private readonly playlistCategoryService: PlaylistCategoriesService,
    private readonly configService: ConfigService,
  ) {}

  private readonly BUCKET = 'dubseek-assets';
  private readonly DIRECTORY = 'playlist-covers';

  private s3Client = new S3({
    apiVersion: '2006-03-01',
    region: 'us-east-2',
    params: {
      Bucket: this.BUCKET,
    },
  });

  async create(
    createPlaylistDto: CreatePlaylistDto,
    coverImage: Express.Multer.File,
  ) {
    const existing = await this.playlistRepo.find({
      where: [
        { name: createPlaylistDto.name },
        { slug: createPlaylistDto.slug },
      ],
    });

    if (existing.length > 0) {
      throw new BadRequestException(
        'Playlist with that name or slug already exists',
      );
    }

    const existingCategory = await this.playlistCategoryService.findOne(
      createPlaylistDto.category_id,
    );

    if (!existingCategory) {
      throw new BadRequestException('Playlist category does not exist');
    }

    const filename = `${uuidv4()}${
      (coverImage.originalname.match(/\.+[\S]+$/) || [])[0]
    }`;

    const uploadPromise = this.s3Client
      .putObject({
        Bucket: `${this.BUCKET}/${this.DIRECTORY}`,
        Key: filename,
        Body: coverImage.buffer,
        ContentType: coverImage.mimetype,
      })
      .promise();

    await uploadPromise
      .then(res => {
        console.log(res);
        const newCrate = this.playlistRepo.create({
          ...createPlaylistDto,
          category: existingCategory,
          image_url: filename,
        });
        return this.playlistRepo.save(newCrate);
      })
      .catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
  }

  findAll() {
    return `This action returns all playlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    console.log(updatePlaylistDto);
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
