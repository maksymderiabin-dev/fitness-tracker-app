import { IsString, IsNumber, MinLength } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @MinLength(3)
  title: string; // Назва: наприклад, "Прес 15 хв"

  @IsString()
  type: string; // Тип: Cardio, Strength, Yoga

  @IsNumber()
  duration: number; // Тривалість у хвилинах
}