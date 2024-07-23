import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PlaylistCategory } from '../../playlist-categories/entities/playlist-category.entity';
import { PlaylistSong } from '../../playlist-songs/entities/playlist-song.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  playlist_id: number;

  @ApiProperty()
  @Column({
    unique: true,
  })
  public name: string;

  @ApiProperty()
  @Column()
  public description: string;

  @ApiProperty()
  @Column({
    unique: true,
  })
  public slug: string;

  @ApiProperty()
  @Column()
  public image_url: string;

  @ApiProperty()
  @ManyToOne(() => PlaylistCategory)
  @JoinColumn({ name: 'category_PlaylistCategory' })
  public category: PlaylistCategory;

  @ApiProperty()
  @Column({ type: 'jsonb', default: [], nullable: false })
  public tags: string[];

  @ApiProperty()
  @Column({ default: true })
  public is_enabled: boolean;

  @ApiProperty()
  @Column({ default: false })
  public is_deleted: boolean;

  @OneToMany(
    () => PlaylistSong,
    playlistSong => playlistSong.playlist,
  )
  public playlistSongs!: PlaylistSong[];

  @ApiProperty()
  @CreateDateColumn()
  public created_at: Date;

  @ApiProperty()
  @CreateDateColumn()
  public updated_at: Date;
}
