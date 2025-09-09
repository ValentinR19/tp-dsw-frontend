import { FooterComponent } from '@admin-layout-module/footer/footer.component';
import { HeaderComponent } from '@admin-layout-module/header/header.component';
import { SidebarComponent } from '@admin-layout-module/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, SidebarComponent, HeaderComponent, RouterModule, FooterComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobile = false;
  isMobileSidebarOpen = false;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 1000;
    if (!this.isMobile) {
      this.isMobileSidebarOpen = false;
    }
  }

  ngOnInit() {
    this.onResize();
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  onSidebarItemClick() {
    if (this.isMobile) {
      this.isMobileSidebarOpen = false;
    }
  }
}
