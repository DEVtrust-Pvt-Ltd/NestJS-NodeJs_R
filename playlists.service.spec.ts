import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistCategory } from '../playlist-categories/entities/playlist-category.entity';
import { PlaylistCategoriesService } from '../playlist-categories/playlist-categories.service';
import { Playlist } from './entities/playlist.entity';
import { PlaylistsService } from './playlists.service';

describe('PlaylistsService', () => {
  let service: PlaylistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        PlaylistCategoriesService,
        ConfigService,
        {
          // how you provide the injection token in a test instance
          provide: getRepositoryToken(Playlist),
          // as a class value, Repository needs no generics
          useClass: Repository,
        },
        {
          // how you provide the injection token in a test instance
          provide: getRepositoryToken(PlaylistCategory),
          // as a class value, Repository needs no generics
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
