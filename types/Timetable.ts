import { Room } from "@/app/dashboard/classrooms/types"

export interface ITimetable {
  id: number;
  disciplineId: number;
  days: string;
  hours: string;
  educator: {
    id: number;
    name: string;
    lattesLink: string;
  };
  room?: Room;
}
