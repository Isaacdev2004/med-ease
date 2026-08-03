import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;
}

export class DirectoryAddressDto {
  @ApiProperty()
  street!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  department!: string;

  @ApiProperty()
  postalCode!: string;

  @ApiProperty()
  country!: string;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  longitude?: number;
}

export class DirectoryProviderDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiPropertyOptional()
  finessNumber?: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  specialty?: string;

  @ApiPropertyOptional()
  medicalSpecialty?: string;

  @ApiPropertyOptional()
  facilityType?: string;

  @ApiProperty({ type: () => DirectoryAddressDto })
  address!: DirectoryAddressDto;

  @ApiPropertyOptional()
  distanceKm?: number;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  availability?: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ type: String, isArray: true })
  languages!: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  insuranceAccepted?: string[];

  @ApiPropertyOptional()
  teleconsultation?: boolean;

  @ApiPropertyOptional()
  emergencyServices?: boolean;

  @ApiPropertyOptional({ type: String, isArray: true })
  accessibility?: string[];

  @ApiPropertyOptional()
  openingHours?: Record<string, string>;

  @ApiPropertyOptional({ type: String, isArray: true })
  services?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  qualifications?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  associatedFacilityIds?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  relatedProfessionalIds?: string[];

  @ApiProperty()
  updatedAt!: string;
}

export class DirectoryFacetsDto {
  @ApiProperty({ type: String, isArray: true })
  specialties!: string[];

  @ApiProperty({ type: String, isArray: true })
  departments!: string[];

  @ApiProperty({ type: String, isArray: true })
  cities!: string[];
}

export class DirectorySearchResultDto {
  @ApiProperty({ type: () => DirectoryProviderDto, isArray: true })
  items!: DirectoryProviderDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty({ type: () => DirectoryFacetsDto })
  facets!: DirectoryFacetsDto;
}

export class DirectoryStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  professionals!: number;

  @ApiProperty()
  facilities!: number;

  @ApiProperty()
  pharmacies!: number;

  @ApiProperty()
  transport!: number;

  @ApiProperty()
  favorites!: number;
}

export class ToggleFavoriteResultDto {
  @ApiProperty()
  isFavorite!: boolean;
}
