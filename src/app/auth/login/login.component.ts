import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

// Declarar google como variable global (Google Identity Services)
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    console.log('LoginComponent inicializado');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit ejecutado - Intentando renderizar botón de Google');
    this.renderGoogleButton();
  }

  /**
   * Login tradicional con email y password
   */
  login() {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.usuarioService.login(this.loginForm.value)
      .subscribe(
        resp => {
          if (this.loginForm.get('remember').value) {
            localStorage.setItem('email', this.loginForm.get('email').value);
          } else {
            localStorage.removeItem('email');
          }
          this.router.navigateByUrl('/');
        }, 
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  /**
   * Renderizar el botón de Google
   * Espera a que la librería de Google Identity Services esté disponible
   */
  renderGoogleButton() {
    let intentos = 0;
    const maxIntentos = 50; // 5 segundos (50 * 100ms)

    const checkGoogleLoaded = setInterval(() => {
      intentos++;
      
      if (typeof google !== 'undefined' && google.accounts) {
        console.log('✅ Google Identity Services cargado correctamente');
        clearInterval(checkGoogleLoaded);
        this.initializeGoogleButton();
      } else if (intentos >= maxIntentos) {
        console.error('❌ Timeout: Google Identity Services no se cargó después de 5 segundos');
        clearInterval(checkGoogleLoaded);
        
        // Mostrar mensaje de error al usuario
        const container = document.getElementById('google-btn');
        if (container) {
          container.innerHTML = `
            <div style="color: #dc3545; padding: 10px; text-align: center;">
              <small>⚠️ No se pudo cargar el botón de Google. Por favor, recarga la página.</small>
            </div>
          `;
        }
      } else {
        console.log(`⏳ Esperando Google Identity Services... (intento ${intentos}/${maxIntentos})`);
      }
    }, 100);
  }

  /**
   * Inicializar el botón de Google Identity Services
   */
  initializeGoogleButton() {
    try {
      console.log('Inicializando Google Sign-In...');

      // Inicializar Google Identity Services
      google.accounts.id.initialize({
        client_id: '277566784792-4j8p8g31fgjnqiqem4fg2tqih1bvf3it.apps.googleusercontent.com',
        callback: (response: any) => this.handleCredentialResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Obtener el contenedor donde se renderizará el botón
      const buttonContainer = document.getElementById('google-btn');
      
      if (!buttonContainer) {
        console.error('❌ No se encontró el contenedor #google-btn en el DOM');
        return;
      }

      console.log('Renderizando botón de Google...');

      // Renderizar el botón de Google
      google.accounts.id.renderButton(
        buttonContainer,
        { 
          theme: 'outline',           // 'outline' | 'filled_blue' | 'filled_black'
          size: 'large',              // 'small' | 'medium' | 'large'
          width: 300,                 // Ancho en píxeles
          text: 'signin_with',        // 'signin_with' | 'signup_with' | 'continue_with'
          shape: 'rectangular',       // 'rectangular' | 'pill' | 'circle' | 'square'
          logo_alignment: 'left'      // 'left' | 'center'
        }
      );

      console.log('✅ Botón de Google renderizado correctamente');

      // Opcional: Habilitar One Tap (inicio de sesión automático)
      // google.accounts.id.prompt();

    } catch (error) {
      console.error('❌ Error al inicializar Google Sign-In:', error);
      
      const container = document.getElementById('google-btn');
      if (container) {
        container.innerHTML = `
          <div style="color: #dc3545; padding: 10px; text-align: center;">
            <small>⚠️ Error al cargar el botón de Google</small>
          </div>
        `;
      }
    }
  }

  /**
   * Manejar la respuesta de Google cuando el usuario hace login
   * @param response Objeto con el credential (JWT token)
   */
  handleCredentialResponse(response: any) {
    console.log('✅ Respuesta de Google recibida');
    
    const token = response.credential;
    console.log('Token JWT recibido, enviando al backend...');
    
    this.usuarioService.loginGoogle(token)
      .subscribe(
        resp => {
          console.log('✅ Login con Google exitoso:', resp);
          
          // Usar NgZone para asegurar que Angular detecte el cambio de ruta
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          });
        },
        error => {
          console.error('❌ Error en login con Google:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'No se pudo autenticar con Google. Por favor, intenta de nuevo.',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  /**
   * Validar si un campo del formulario es inválido
   * @param campo Nombre del campo a validar
   */
  campoNoValido(campo: string): boolean {
    if (this.loginForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
}