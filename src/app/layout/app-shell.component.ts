import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { APP_NAV_ITEMS } from '../core/config/api.config';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);

  readonly navItems = APP_NAV_ITEMS;
  readonly username = computed(() => this.authService.username());

  logout(): void {
    this.authService.logout().subscribe();
  }
}
