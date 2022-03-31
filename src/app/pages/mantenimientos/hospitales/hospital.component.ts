import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styles: [
  ]
})
export class HospitalComponent implements OnInit {

  public hospitalForm: FormGroup;
  public hospitalSeleccionado: Hospital;
  router: any;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe( ({ id }) => this.cargarHospital( id ) );

    this.hospitalForm = this.fb.group({
      nombre: ['', Validators.required ],
      hospital: ['', Validators.required ],
    });

  }

  cargarHospital(id: string) {

    if ( id === 'nuevo' ) {
      return;
    }

     this.hospitalService.obtenerHospitalPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe( hospital => {

        if ( !hospital ) {
          return this.router.navigateByUrl(`/dashboard/hospitales`);
        }

        console.log(hospital);

        const { nombre, img  } = hospital; 

        this.hospitalSeleccionado = hospital;

        this.hospitalForm.setValue({ nombre, img });

      });

  }

  guardarHospital() {

    const { nombre } = this.hospitalForm.value;

    if ( this.hospitalSeleccionado) {
      // actualizar
      const data = {
        ...this.hospitalForm.value,
        _id: this.hospitalSeleccionado._id
      }
      this.hospitalService.actualizarHospital ( data, )
        .subscribe( resp => {
          Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');
        })

    } else {
      // crear
      
      this.hospitalService.crearHospital( this.hospitalForm.value )
          .subscribe( (resp: any) => {
            Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
            this.router.navigateByUrl(`/dashboard/hospital/${ resp.hospital_id }`)
        })
    }

    

  }


}
