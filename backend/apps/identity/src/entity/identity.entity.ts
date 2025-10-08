import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from "@app/common";
// import { UserRole } from '../../../../libs/common/src/constants/user-role.enum';

@Entity()
export class IdentityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;
}
