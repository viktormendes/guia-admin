export interface Room {
  id: number;
  description: string;
  floor: number;
  capacity: number;
  type: RoomType;
  block_id: number;
  block: Block | null;
}

export interface Block {
  id: number;
  description: string;
  status: BlockStatus;
  number_of_floors: number;
}

export enum BlockStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BUILDING = 'BUILDING',
}

export enum RoomType {
  CLASSROOM = 'Sala de Aula',
  LABORATORY = 'Laboratório',
  AUDITORIUM = 'Auditório',
  TEACHERS_ROOM = 'Sala Docentes',
  ADMINISTRATIVE = 'Administrativo',
}

export interface CreateRoomDto {
  description: string;
  floor: number;
  block_id: number;
  capacity: number;
  type: RoomType;
}

export interface UpdateRoomDto {
  description?: string;
  floor?: number;
  block_id?: number;
  capacity?: number;
  type?: RoomType;
} 