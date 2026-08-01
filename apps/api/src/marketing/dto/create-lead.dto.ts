import { IsObject, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarketingLeadDto {
  @ApiProperty({ example: 'hub' })
  @IsString()
  @MinLength(1)
  ctaId!: string;

  @ApiProperty({
    example: {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie@example.com',
    },
  })
  @IsObject()
  fields!: Record<string, unknown>;
}
