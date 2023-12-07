import { Component, OnInit, ViewChild } from '@angular/core';
import { VitalSign } from 'src/app/model/vitalSign';
import { VitalSignService } from 'src/app/service/vitalSing.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';


@Component({
  standalone: true,
  selector: 'app-vital-sign',
  templateUrl: './vital-sign.component.html',
  styleUrls: ['./vital-sign.component.css'],
  imports:[MaterialModule, RouterLink, RouterOutlet]
})
export class VitalSignComponent implements OnInit {

  cantidad: number = 0;
  dataSource: MatTableDataSource<VitalSign>;
  displayedColumns = ['idSign', 'patient', 'vitalSignDate', 'temperature', 'pulse', 'respiratoryRate', 'actions'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private vitalSignService : VitalSignService, private snack : MatSnackBar) { }

  ngOnInit() {
    this.vitalSignService.vitalSignChange.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.vitalSignService.messageChange.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.vitalSignService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }
  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idSignos: number) {
    this.vitalSignService.delete(idSignos).subscribe(() => {
      this.vitalSignService.findAll().subscribe(data => {
        this.vitalSignService.vitalSignChange.next(data);
        this.vitalSignService.messageChange.next('SE ELIMINO');

      });
    });
  }

  mostrarMas(e: any){
    this.vitalSignService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      console.log(data);
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

}