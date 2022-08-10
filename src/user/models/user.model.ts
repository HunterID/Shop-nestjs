import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RefreshToken } from '../../auth/token/model/refreshToken.model';
import { UserToRole } from './userRole.model';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String })
  firstName: string;

  @Column({ type: String })
  lastName: string;

  @Column({ type: String })
  password: string;

  @Column({ type: String, unique: true })
  mail: string;

  @Column({ type: 'text', nullable: false })
  avatar: string;

  @Column({ type: 'text', nullable: false, unique: true })
  stripeCustomerId: string;

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt: Date;

  @OneToMany(() => UserToRole, (UserToRole) => UserToRole.user, { cascade: true })
  user: UserToRole[];

  @OneToMany(() => RefreshToken, (token) => token.user, { cascade: true })
  token: RefreshToken[];
}
