import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SignupDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => User)
  users: User[];
}

export enum Country {
  'United_States' = 'United States',
  'United_Kingdom' = 'United Kingdom',
  'Indonesia' = 'Indonesia',
  'Canada' = 'Canada',
  'Ukraine' = 'Ukraine',
}

export class Experience {
  @IsString()
  @IsNotEmpty()
  role_title: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(Country)
  @IsNotEmpty()
  country: Country;

  @IsInt()
  @Min(1900)
  start_year: number;

  @IsInt()
  @Min(1900)
  @IsOptional()
  end_year?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class Education {
  @IsString()
  @IsNotEmpty()
  school_label: string;

  @IsString()
  @IsNotEmpty()
  degree_label: string;

  @IsString()
  @IsNotEmpty()
  area_of_study_label: string;

  @IsString()
  @IsNotEmpty()
  dates_attended_label_start: string;

  @IsString()
  @IsNotEmpty()
  dates_attended_label_end: string;
}

export class Language {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsInt()
  @Min(0)
  @Max(4)
  level: number;
}

export class User {
  @IsString()
  @IsNotEmpty()
  first: string;

  @IsString()
  @IsNotEmpty()
  last: string;

  @IsEmail()
  email: string;

  @IsEnum(Country)
  @IsNotEmpty()
  country: Country;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  birth_date: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  state: string;

  @IsString()
  @IsNotEmpty()
  zip_code: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  @IsNotEmpty()
  role_title: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Experience)
  experience: Experience[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Education)
  education: Education[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Language)
  languages: Language[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  @Max(1000)
  rate: number;
}
