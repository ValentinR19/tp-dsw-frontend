import { Informe } from '@main-module/app/permissions/informe/models/classes/informe.entity';

export class Role {
  id: number;
  name: string;
  isPublic: boolean;
  informes: Informe[];
}
