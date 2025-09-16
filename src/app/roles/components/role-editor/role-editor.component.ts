import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Informe } from '@main-module/app/permissions/informe/models/classes/informe.entity';
import { IGroupedInforme } from '@main-module/app/permissions/informe/models/interfaces/grouped-informes.interface';
import { InformeService } from '@main-module/app/permissions/informe/services/informe.service';
import { Role } from '@main-module/app/roles/models/classes/role.entity';
import { RoleService } from '@main-module/app/roles/services/role.service';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-role-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, ButtonModule],
  templateUrl: './role-editor.component.html',
  styleUrl: './role-editor.component.scss',
})
export class RoleEditorComponent implements OnInit {
  role: Role;
  roleForm: FormGroup;
  informes: Informe[] = [];
  groupedInformes: IGroupedInforme[] = [];
  roleId: number;

  private readonly roleService: RoleService = inject(RoleService);
  private readonly informeService: InformeService = inject(InformeService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);

  ngOnInit(): void {
    this.buildForm();
    this.roleId = this.dialogConfig.data;
    this.findAllInformes();
    if (this.roleId) {
      this.roleService.getById(this.roleId).subscribe((role) => {
        this.role = role;
        this.roleForm.patchValue({
          name: role.name,
          informes: role.informes.map((i) => i.id),
        });
        this.groupInformes();
      });
    }
  }

  buildForm(): void {
    this.roleForm = new FormGroup({
      name: new FormControl<string>('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
      informes: new FormControl<Informe[]>([], [Validators.required]),
    });
  }

  groupInformes() {
    this.groupedInformes = this.informes.reduce((acc, informe) => {
      let grupo = acc.find((g) => g.label === informe.tipoInforme.description);

      if (!grupo) {
        grupo = {
          label: informe.tipoInforme.description,
          items: [],
        };
        acc.push(grupo);
      }

      grupo.items.push({
        id: informe.id,
        description: informe.description,
      });

      return acc;
    }, []);
  }

  findAllInformes(): void {
    this.informeService.findAll().subscribe((informes) => {
      this.informes = informes;
      this.groupInformes();
    });
  }

  submit(): void {
    if (this.roleForm.invalid) {
      return;
    }
    const updatedRole = {
      ...this.role,
      name: this.roleForm.value.name,
      informes: this.roleForm.value.informes.map((id: number) => ({ id })),
    };

    this.roleId ? this.update(updatedRole) : this.create(updatedRole);
  }

  update(updateRole: Partial<Role>): void {
    this.roleService.update(this.roleId, updateRole).subscribe({
      next: () => {
        this.messageService.showSuccessMessage('Role updated successfully');
        this.close();
      },
      error: (e) => {
        this.messageService.showErrorFromDTO(e);
      },
      complete: () => {},
    });
  }

  create(updateRole: Partial<Role>): void {
    this.roleService.create(updateRole).subscribe({
      next: () => {
        this.messageService.showSuccessMessage('Role created successfully');
        this.close();
      },
      error: (e) => {
        this.messageService.showErrorFromDTO(e);
      },
      complete: () => {},
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
