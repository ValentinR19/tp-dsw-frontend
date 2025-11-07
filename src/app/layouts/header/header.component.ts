import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth-module/services/auth.service';
import { User } from '@main-module/app/users/models/classes/user.entity';
import { UserService } from '@main-module/app/users/services/user.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  user: User;
  isSettingsDropdownOpen = false;
  subscription: Subscription;
  @Output() toggleSidebar = new EventEmitter<void>();
  @ViewChild('dropdownMenu') dropdown: any;

  constructor(
    public authService: AuthService,
    private readonly detector: ChangeDetectorRef,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.authService.loggedUser$.subscribe((appUser) => {
      if (appUser && appUser.id) {
        this.userService.getById(appUser.id).subscribe({
          next: (user: User) => {
            this.user = user;
            this.detector.detectChanges();
          },
          error: (error) => {
            console.error('Error encontrando el usuario:', error);
          },
        });
      }
    });
  }

  toggleSettingsDropdown() {
    this.isSettingsDropdownOpen = !this.isSettingsDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.settings-dropdown')) {
      this.isSettingsDropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
  }

  updateProfile() {
  // Podriamos crear una seccion sobre mi cuenta aparte, para AD
  if (this.user?.id) {
    this.router.navigate([`users/${this.user.id}/edit`]);
  }
  this.isSettingsDropdownOpen = false;
}

  getInitials(fullName: string): string {
    if (!fullName) return '?';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getAvatarColor(fullName: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const index = fullName?.length % colors.length || 0;
    return colors[index];
  }
}
