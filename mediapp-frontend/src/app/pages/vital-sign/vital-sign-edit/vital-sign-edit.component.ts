import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { VitalSign } from 'src/app/model/vitalSign';
import { VitalSignService } from 'src/app/service/vitalSing.service';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { ActivatedRoute, Params, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { PatientModalComponent } from 'src/app/pages/patient/patient-modal/patient-modal.component';
import * as moment from 'moment';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-vital-sign-edit',
  templateUrl: './vital-sign-edit.component.html',
  styleUrls: ['./vital-sign-edit.component.css'],
  imports: [NgIf, NgFor, MaterialModule, FlexLayoutModule, ReactiveFormsModule, AsyncPipe] 
})



export class VitalSignEditComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private vitalSignService : VitalSignService,
    private patientService : PatientService,
    private datepipe: DatePipe,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'id_paciente' : new FormControl('', [Validators.required]),
      'nombre' : new FormControl('', [Validators.required]),
      'fecha' : new FormControl('', Validators.required),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
      this.filteredOptions = this.form.controls['nombre'].valueChanges.pipe(
        //startWith(""), 
        map(val => this.filter(val))
      );
      this.form.get('nombre').valueChanges.subscribe((nomb:string) => {
        const idx = nomb.indexOf(':');
        this.form.patchValue({
          'id_paciente': idx > 0 ? parseInt(nomb.substring(0, idx)) : ''
        });
      })
    });
  }

  initForm(){
    if(this.edicion){
      this.vitalSignService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSign),
          'id_paciente' : new FormControl(data.patient.idPatient, [Validators.required]),
          'nombre' : new FormControl(data.patient.idPatient + ': ' + data.patient.firstName + ' ' + data.patient.lastName, [Validators.required, Validators.minLength(3)]),
          'fecha': new FormControl(this.datepipe.transform(new Date(data.vitalSignDate), 'yyyy-MM-dd'), Validators.required),
          'temperatura': new FormControl(data.temperature),
          'pulso': new FormControl(data.pulse),
          'ritmoRespiratorio': new FormControl(data.respiratoryRate)
        });
      });
    }
    this.actualizarAutocomplete();
  }

  actualizarAutocomplete() {
    this.patientService.findAll().subscribe(data => {
      this.options = data.map(paciente => {
        return (paciente.idPatient + ': ' + paciente.firstName + ' ' + paciente.lastName).trim();
      });
    });
  }

  filter(val: string): string[] {
    return this.options.filter(option => {
      return option.toLowerCase().match(val.toLowerCase());
    });
  }

  get f() { return this.form.controls; }

  nuevoPaciente() {
    const dialogRef = this.dialog.open(PatientModalComponent, {
      width: '360px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((patient: Patient) => {
      if (patient) {
        this.actualizarAutocomplete();
        this.form.patchValue({
          'id_paciente': patient.idPatient,
          'nombre': patient.idPatient + ': ' + patient.firstName + ' ' + patient.lastName
        });
      }
    });
  }

  operar(){
    if(this.form.invalid){
      return;
    }

    let vitalSign = new VitalSign();
    vitalSign.idSign = this.form.value['id'];
    vitalSign.patient = new Patient();
    vitalSign.patient.idPatient = this.form.value['id_paciente'];
    vitalSign.vitalSignDate = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    vitalSign.temperature = this.form.value['temperatura'];
    vitalSign.pulse = this.form.value['pulso'];
    vitalSign.respiratoryRate = this.form.value['ritmoRespiratorio'];

    if(this.edicion){
      this.vitalSignService.update(vitalSign.idSign, vitalSign).subscribe( () => { this.notificarCambio('SE MODIFICO'); });
    }else{
      this.vitalSignService.save(vitalSign).subscribe( () => { this.notificarCambio('SE REGISTRO'); });
    }
    this.router.navigate(['vital-sign']);
  }

  notificarCambio(msg: string) {
    this.vitalSignService.findAll().subscribe(data => {
      this.vitalSignService.vitalSignChange.next(data);
      this.vitalSignService.messageChange.next(msg);
    });
  }

}