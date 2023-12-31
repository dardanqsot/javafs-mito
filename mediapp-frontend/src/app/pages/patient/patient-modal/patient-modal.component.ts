import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from 'src/app/model/patient';
import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/service/patient.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  templateUrl: './patient-modal.component.html',
  styleUrls: ['./patient-modal.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, NgIf, NgFor]
})
export class PatientModalComponent implements OnInit {
  form: FormGroup;

  constructor(
    private patientService : PatientService,
    public dialogRef: MatDialogRef<PatientModalComponent>
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'firstName' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'lastName' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'email': new FormControl(''),
      'phone': new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      'dni': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      'address': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)])
      
    });
  }

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) return;
    const patient: Patient = new Patient();
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.email = this.form.value['email'];
    patient.phone = this.form.value['phone'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    this.patientService.save(patient).subscribe(data => {
      this.dialogRef.close(data);
    });
  }

  dispose() {
    this.dialogRef.close();
  }

}