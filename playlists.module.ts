import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { Playlist } from './entities/playlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PlaylistCategoriesModule } from '../playlist-categories/playlist-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist]), PlaylistCategoriesModule],
  controllers: [PlaylistsController],
  providers: [PlaylistsService, ConfigService],
})
export class PlaylistsModule {}
