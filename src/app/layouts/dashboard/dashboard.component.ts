import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth-module/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports:[],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  usuarioNombre: string = 'Usuario';
  fechaActual: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.loggedUser;
    this.usuarioNombre = user?.fullName || user?.username || 'Usuario';


    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.fechaActual = new Date().toLocaleDateString('es-AR', opciones);
  }
}
