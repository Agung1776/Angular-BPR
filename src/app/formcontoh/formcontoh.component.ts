import { Component, OnInit, ViewChild, inject, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PinjamanService } from '../pinjaman.service';
import { TableModule, FormModule, ColComponent, RowComponent, GridModule, ButtonModule, UtilitiesModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { LoanInfoService } from '../loan-info.service';
import autoTable from 'jspdf-autotable'
export interface LoanInfo {
  id?: number;
  amortization: string;
  tenorMonths: number;
  interestRate: number;
  amount: number;
  paymentMethod: string;
  disbursementDate: string;
  maturityDate: string;
}

@Component({
  selector: 'app-formcontoh',
  standalone: true,
  imports: [TableModule, FormModule, ColComponent, RowComponent, GridModule, ReactiveFormsModule, CommonModule, ButtonModule, UtilitiesModule],
  templateUrl: './formcontoh.component.html',
  styleUrls: ['./formcontoh.component.css'],
})



export class FormcontohComponent implements OnInit {
  @ViewChild('pdfExport', { static: false }) pdfExport!: ElementRef;
  pinjamanForm!: FormGroup;
  hasilPerhitungan: any[] = [];
  LoanInfoService = inject(LoanInfoService);
  isFormVisible = true;
  totalBunga = 0;
  totalPokok = 0;
  totalAngsuran = 0;
  showPdfTable: boolean = false;

  constructor(private fb: FormBuilder, private pinjamanService: PinjamanService) {}

  ngOnInit() {
    this.pinjamanForm = this.fb.group({
      jangkaWaktuThn: ['', [Validators.pattern('^[0-9]+$')]],
      jangkaWaktuBln: ['', [Validators.pattern('^[0-9]+$')]],
      tanggalValuta: [''],
      pokokPinjaman: [''],
      sukuBungaEfektif: [''],
      caraHitungAngsuran: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      caraBayarAngsuran: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }
  getAmortizationValue(value: string): string {
    switch (value) {
      case "0":
        return 'PAT';
      case "1":
        return 'PPT';
      case "2":
        return 'FLAT';
      case "3":
        return 'SLIDING';
      default:
        return 'Unknown';
    }
  }
  
  getPaymentMethodValue(value: string): string {
    switch (value) {
      case "1":
        return 'In-Arrear';
      case "2":
        return 'In-Advance';
      default:
        return 'Unknown';
    }
  }
  
  onSubmit() {
    if (this.pinjamanForm.valid) {
      const { jangkaWaktuThn, jangkaWaktuBln, tanggalValuta, pokokPinjaman, sukuBungaEfektif, caraHitungAngsuran, caraBayarAngsuran } = this.pinjamanForm.value;
      const hitungAngsuran = parseInt(caraHitungAngsuran, 10);
      const bayarAngsuran = parseInt(caraBayarAngsuran, 10);
      console.log('Form Values:', this.pinjamanForm.value);
      this.hasilPerhitungan = this.pinjamanService.hitungPinjaman(jangkaWaktuThn, jangkaWaktuBln, tanggalValuta, pokokPinjaman, sukuBungaEfektif, hitungAngsuran, bayarAngsuran);
      console.log('Calculation Result:', this.hasilPerhitungan);
      this.calculateTotals();
      const tenorMonths = (parseInt(jangkaWaktuThn, 10) || 0) * 12 + (parseInt(jangkaWaktuBln, 10) || 0);
      const maturityDate = this.calculateMaturityDate(tanggalValuta, tenorMonths);
      const loanInfo: LoanInfo = {
        amortization: this.getAmortizationValue(caraHitungAngsuran),
        tenorMonths: tenorMonths,
        interestRate: parseFloat(parseFloat(sukuBungaEfektif).toFixed(2)), 
        amount: parseFloat(pokokPinjaman), 
        paymentMethod: this.getPaymentMethodValue(caraBayarAngsuran),
        disbursementDate: tanggalValuta,
        maturityDate: maturityDate
      };
      console.log(loanInfo);
      this.LoanInfoService.createLoanInfo(loanInfo).subscribe(response => {
        console.log('Loan info submitted successfully', response);
      }, error => {
        console.error('Error submitting loan info', error);
      });
    }
  }

  calculateMaturityDate(startDate: string, tenorMonths: number): string {
    const start = new Date(startDate);
    start.setMonth(start.getMonth() + tenorMonths);
    const year = start.getFullYear();
    const month = (start.getMonth() + 1).toString().padStart(2, '0');
    const day = start.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  calculateTotals() {
    this.totalBunga = parseFloat(this.hasilPerhitungan.reduce((sum, item) => {
      const value = parseFloat(item.bunga.replace(/,/g, '').trim());
      return !isNaN(value) ? sum + value : sum;
    }, 0).toFixed(2));
  
    this.totalPokok = parseFloat(this.hasilPerhitungan.reduce((sum, item) => {
      const value = parseFloat(item.pokok.replace(/,/g, '').trim());
      return !isNaN(value) ? sum + value : sum;
    }, 0).toFixed(2));
  
    this.totalAngsuran = parseFloat(this.hasilPerhitungan.reduce((sum, item) => {
      const value = parseFloat(item.totalAngsuran.replace(/,/g, '').trim());
      return !isNaN(value) ? sum + value : sum;
    }, 0).toFixed(2));
  
    console.log(`Total Bunga: ${this.totalBunga}`);
    console.log(`Total Pokok: ${this.totalPokok}`);
    console.log(`Total Angsuran: ${this.totalAngsuran}`);
  }
  
  togglePdfTable() {
    this.showPdfTable = !this.showPdfTable; // Toggle the visibility of the PDF table
  }

  
  

  public generatePDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
    const padding = 15;
    const getValueFromCase = (value: string): string => {
      switch(value) {
        case "0":
          return 'PAT';
        case "1":
          return 'PPT';
        case "2":
          return 'FLAT';
        case "3":
          return 'SLIDING';
        default:
          return 'Unknown';
      }
    };
    const getValueFromCase1 = (value: string): string => {
      switch(value) {
        case "1":
          return 'In-Arrear';
        case "2":
          return 'In-Advance';
        default:
          return 'Unknown';
      }
    };
    const formatNumber=(value: number): string =>{
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const caraHitungAngsuranValue = this.pinjamanForm.get('caraHitungAngsuran')?.value;
    const caraHitungAngsuran = getValueFromCase(caraHitungAngsuranValue);
    const caraBayarAngsuranValue = this.pinjamanForm.get('caraBayarAngsuran')?.value;
    const caraBayarAngsuran = getValueFromCase1(caraBayarAngsuranValue);
    const jangkaWaktuThn = this.pinjamanForm.get('jangkaWaktuThn')?.value;
    const jangkaWaktuBln = this.pinjamanForm.get('jangkaWaktuBln')?.value;
    const jangkaWaktuThnValue = jangkaWaktuThn ? parseInt(jangkaWaktuThn, 10) : 0;
    const jangkaWaktuBlnValue = jangkaWaktuBln ? parseInt(jangkaWaktuBln, 10) : 0;
    
    let combinedJangkaWaktu = '';
    if (jangkaWaktuThnValue !== 0) {
      combinedJangkaWaktu += `${jangkaWaktuThnValue} Tahun`;
    }
    if (jangkaWaktuBlnValue !== 0) {
      if (combinedJangkaWaktu !== '') {
        combinedJangkaWaktu += ', ';
      }
      combinedJangkaWaktu += `${jangkaWaktuBlnValue} Bulan`;
    }

    const tanggalValuta = this.pinjamanForm.get('tanggalValuta')?.value;
    const pokokPinjaman = this.pinjamanForm.get('pokokPinjaman')?.value;
    const formattedPokokPinjaman = formatNumber(pokokPinjaman);
    const sukuBungaEf = this.pinjamanForm.get('sukuBungaEfektif')?.value;
    const sukuBungaEfektif = `${sukuBungaEf} % p.a`;

    doc.text('Cara Hitung Angsuran', padding, 20);
    doc.text(':', padding + 57, 20);
    doc.text(caraHitungAngsuran, padding + 60, 20);
    
    doc.text('Cara Bayar Angsuran', padding, 30);
    doc.text(':', padding + 57, 30);
    doc.text(caraBayarAngsuran, padding + 60, 30);

    doc.text('Pokok Pinjaman', padding, 40);
    doc.text(':', padding + 57, 40);
    doc.text(formattedPokokPinjaman, padding + 60, 40);

    doc.text('Tanggal Valuta', padding, 50);
    doc.text(':', padding + 57, 50);
    doc.text(tanggalValuta, padding + 60, 50);

    doc.text('Dicicil selama', padding, 60);
    doc.text(':', padding + 57, 60);
    doc.text(combinedJangkaWaktu, padding + 60, 60);

    doc.text('Suku Bunga Efektif', padding, 70);
    doc.text(':', padding + 57, 70);
    doc.text(sukuBungaEfektif, padding + 60, 70);

    const columns = [
      { header: "Ke", dataKey: "ke" },
      { header: "Tanggal", dataKey: "tanggal" },
      { header: "Bunga", dataKey: "bunga" },
      { header: "Pokok", dataKey: "pokok" },
      { header: "Total Angsuran", dataKey: "totalAngsuran" },
      { header: "Saldo Akhir", dataKey: "saldoAkhir" }
    ];

    const rows = this.hasilPerhitungan.slice(0, -1).map(item => ({
      ke: item.ke,
      tanggal: item.tanggal,
      bunga: { content: item.bunga, styles: { halign: 'right' } },
      pokok: { content: item.pokok, styles: { halign: 'right' } },
      totalAngsuran: { content: item.totalAngsuran, styles: { halign: 'right' } },
      saldoAkhir: { content: item.saldoAkhir, styles: { halign: 'right' } }
    }));

    const totalRow = {
      ke: "",
      tanggal: "Total",
      bunga: { content: this.hasilPerhitungan[this.hasilPerhitungan.length - 1].bunga, styles: { halign: 'right' } },
      pokok: { content: this.hasilPerhitungan[this.hasilPerhitungan.length - 1].pokok, styles: { halign: 'right' } },
      totalAngsuran: { content: this.hasilPerhitungan[this.hasilPerhitungan.length - 1].totalAngsuran, styles: { halign: 'right' } },
      saldoAkhir: { content: "", styles: { halign: 'right' } }
    };

    rows.push(totalRow);

    autoTable(doc, {
      head: [columns.map(col => col.header)], 
      body: rows.map(row => [
        row.ke,
        row.tanggal,
        row.bunga.content,
        row.pokok.content,
        row.totalAngsuran.content,
        row.saldoAkhir.content
      ]),
      startY: 80,
      columnStyles: {
        2: { halign: 'right' }, 
        3: { halign: 'right' }, 
        4: { halign: 'right' }, 
        5: { halign: 'right' }  
      }
  });

  doc.save('tableToPdf.pdf');

  }
}
  
