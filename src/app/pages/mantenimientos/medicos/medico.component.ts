import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado! : Hospital | undefined;
  public medicoSeleccionado! : Medico | undefined;
  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router) { }

  ngOnInit(): void {

    this.medicoForm = this.fb.group({
      nombre: new FormControl('Fernando', Validators.required ),
      hospital: new FormControl('', Validators.required ),
    });
    this.cargarHospitales();

    this.medicoForm.get('hospital')!.valueChanges.subscribe(hospitalId => {

      this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
     
      
    })
  }

  guardarMedico() {

    console.log(this.medicoForm);
    
    const { nombre } = this.medicoForm.value;

    this.medicoService.crearMedico(this.medicoForm.value).subscribe( (resp: any) => {
      console.log(resp);

    })
  }

  cargarHospitales() {

    this.hospitalService.cargarHospitales().subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
 
      
    })
  }

}
