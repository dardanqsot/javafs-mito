import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { VitalSign } from 'src/app/model/vitalSign';
import { VitalSignService } from 'src/app/service/vitalSing.service';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { ActivatedRoute, Params, Router, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
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
  imports: [MaterialModule, ReactiveFormsModule, FlexLayoutModule, RouterLink, NgIf, NgFor, RouterOutlet, AsyncPipe] 
})


export class VitalSignEditComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  isEdit: boolean;
  options: string[] = [];
  //filteredOptions: Observable<string[]>;
  patientControl: FormControl = new FormControl();
  patientsFiltered$: Observable<Patient[]>;
  patients$: Observable<Patient[]>
  patients: Patient[];

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private vitalSignService : VitalSignService,
    private patientService : PatientService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      idSign : new FormControl(0),
      patient: new FormControl([Validators.required]),
      vitalSignDate : new FormControl(new Date(), [Validators.required]),
      temperature: new FormControl(''),
      pulse: new FormControl(''),
      respiratoryRate: new FormControl(''),

    });

    this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();

    });    
  }

  filterPatients(val: any){
    if(val?.idPatient > 0){
      return this.patients.filter(pa => 
        pa.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || pa.lastName.toLowerCase().includes(val.lastName.toLowerCase()) || pa.dni.includes(val.dni)
      );
    }else{
      return this.patients.filter(pa => 
        pa.firstName.toLowerCase().includes(val?.toLowerCase()) || pa.lastName.toLowerCase().includes(val?.toLowerCase()) || pa.dni.includes(val)
      );
    }
  }

  initForm(){
    if(this.isEdit){
      this.vitalSignService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idSign': new FormControl(data.idSign),
          'patient' : new FormControl(data.patient, [Validators.required]),
         // 'name' : new FormControl(data.patient.idPatient + ': ' + data.patient.firstName+ ' ' + data.patient.lastName, [Validators.required, Validators.minLength(3)]),
          'vitalSignDate': new FormControl(new Date(data.vitalSignDate), Validators.required),
          'temperature': new FormControl(data.temperature),
          'pulse': new FormControl(data.pulse),
          'respiratoryRate': new FormControl(data.respiratoryRate)
        });
      });
    }
    this.updateAutocomplete();
  }

  updateAutocomplete() {
    this.patientService.findAll().subscribe(data => {
      this.options = data.map(patient => {
        return (patient.idPatient + ': ' + patient.firstName + ' ' + patient.lastName).trim();
      });
    });
  }

  filter(val: string): string[] {
    return this.options.filter(option => {
      return option.toLowerCase().match(val.toLowerCase());
    });
  }

  get f() { return this.form.controls; }

  newVitalSign() {
    const dialogRef = this.dialog.open(PatientModalComponent, {
      width: '360px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((patient: Patient) => {
      if (patient) {
        this.updateAutocomplete();
        this.form.patchValue({
          patient: patient,
          //'name': patient.idPatient + ': ' + patient.firstName + ' ' + patient.lastName
        });
      }
    });
  }

  operate() {
    if (this.form.invalid) { return; }

    let vitalSign = new VitalSign();
    vitalSign.idSign = this.form.value['idSign'];
    vitalSign.patient = this.form.value['patient'];
    vitalSign.vitalSignDate = moment(this.form.value['vitalSignDate']).format('YYYY-MM-DDTHH:mm:ss');
    vitalSign.temperature = this.form.value['temperature'];
    vitalSign.pulse = this.form.value['pulse'];
    vitalSign.respiratoryRate = this.form.value['respiratoryRate'];
    

    if (this.isEdit) {
      this.vitalSignService.update(vitalSign.idSign, vitalSign).subscribe(() => {
        this.vitalSignService.findAll().subscribe(data => {
          this.vitalSignService.setVitalSignChange(data);
          this.vitalSignService.setMessageChange('UPDATED!')
        });
      });
    } else {      
      this.vitalSignService.save(vitalSign).pipe(switchMap(()=>{        
        return this.vitalSignService.findAll();
      }))
      .subscribe(data => {
        this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/vital-sign']);
  }

}