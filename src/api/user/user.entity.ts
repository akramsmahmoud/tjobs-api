import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import * as jwt from 'jsonwebtoken';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
  public name: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  public email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 120 })
  public password: string;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token(): string {
    const { id, email } = this;

    return jwt.sign(
      {
        id,
        email,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
