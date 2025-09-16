import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RoleEditorComponent } from '@main-module/app/roles/components/role-editor/role-editor.component';
import { Role } from '@main-module/app/roles/models/classes/role.entity';
import { RoleService } from '@main-module/app/roles/services/role.service';
import { CustomTableDataComponent } from '@main-module/app/shared/components/custom-table/custom-table.component';
import { ITableColumn } from '@main-module/app/shared/interfaces/table-column.interface';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, CustomTableDataComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  providers: [DialogService],
})
export class RoleListComponent implements OnInit {
  roles: Role[];

  columns: ITableColumn[] = [{ name: 'Nombre', attribute: 'name' }];

  private readonly roleService: RoleService = inject(RoleService);
  private readonly dialogService: DialogService = inject(DialogService);

  async ngOnInit(): Promise<void> {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.findAll().subscribe((roles) => {
      this.roles = roles;
    });
  }

  update(event: Role): void {
    const dialogRef = this.dialogService.open(RoleEditorComponent, {
      closable: true,
      modal: true,
      closeOnEscape: true,
      data: event.id,
      styleClass: 'modal-body',
    });
    dialogRef.onClose.subscribe(() => {
      this.loadRoles();
    });
  }

  create(): void {
    const dialogRef = this.dialogService.open(RoleEditorComponent, {
      closable: true,
      modal: true,
      closeOnEscape: true,
      styleClass: 'modal-body',
    });
    dialogRef.onClose.subscribe(() => {
      this.loadRoles();
    });
  }
}
