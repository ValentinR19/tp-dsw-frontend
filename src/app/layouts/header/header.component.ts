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
            console.error('Error fetching user:', error);
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
    this.router.navigate(['users/my-account']);
    this.isSettingsDropdownOpen = false;
  }
}
