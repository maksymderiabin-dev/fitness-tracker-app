import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutsService {
  // Наш масив даних (In-memory БД)
  private workouts = [
    { id: 1, title: 'Ранкова розминка', type: 'Cardio', duration: 15 },
    { id: 2, title: 'Силове тренування', type: 'Strength', duration: 45 }
  ];

  create(createWorkoutDto: CreateWorkoutDto) {
    const newWorkout = {
      id: Date.now(),
      ...createWorkoutDto,
    };
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  findAll() {
    return this.workouts;
  }

  findOne(id: number) {
    return this.workouts.find(w => w.id === id);
  }

  update(id: number, updateWorkoutDto: any) {
    const index = this.workouts.findIndex(w => w.id === id);
    if (index > -1) {
      this.workouts[index] = { ...this.workouts[index], ...updateWorkoutDto };
      return this.workouts[index];
    }
    return null;
  }

  remove(id: number) {
    this.workouts = this.workouts.filter(w => w.id !== id);
    return { deleted: true };
  }
}