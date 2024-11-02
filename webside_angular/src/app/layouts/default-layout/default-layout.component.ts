import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent {

  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

}
