import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InformeService } from '@main-module/app/permissions/informe/services/informe.service';
import { environment } from '@main-module/environments/environment';
import { MenuItem } from 'primeng/api';
import { DrawerModule as primengSidebarModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';

import { tap } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, PanelMenuModule, primengSidebarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  constructor(private readonly informeService: InformeService) {}
  @Input() collapsed = false;
  @Input() mobile = false;
  @Input() visible = false;
  @Output() menuItemClicked = new EventEmitter<void>();

  menu: MenuItem[] = [];
  appVersion = environment.APP_VERSION;
  iconClass = 'pi pi-fw pi-angle-down';

  sidebarPosicion: string = 'right';

  ngOnInit() {
    this.informeService
      .getMenu()
      .pipe(
        tap((menu: MenuItem[]) => {
          this.menu = menu;
        }),
      )
      .subscribe();
  }

  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  toggleIcon() {
    this.iconClass = this.iconClass === 'pi pi-fw pi-angle-down' ? 'pi pi-fw pi-angle-up' : 'pi pi-fw pi-angle-down';
  }

  onMenuItemClick(): void {
    if (this.mobile) {
      this.menuItemClicked.emit();
    }
  }
}
