import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PinjamanService {
  hitungPinjaman(
    jangkaWaktuThn: number,
    jangkaWaktuBln: number,
    tanggalValuta: string,
    pokokPinjaman: number,
    bungaEfektif: number,
    caraHitungAngsuran: number,
    caraBayarAngsuran: number
  ) {
    console.log('Cara Hitung Angsuran:', caraHitungAngsuran); // Debugging line
    if (caraHitungAngsuran === 1) {
      console.log('Using PPT calculation');
      return this.PPT(jangkaWaktuThn, jangkaWaktuBln, tanggalValuta, pokokPinjaman, bungaEfektif, caraBayarAngsuran);
    } else if (caraHitungAngsuran === 2) {
      console.log('Using FLAT calculation');
      return this.FLAT(jangkaWaktuThn, jangkaWaktuBln, tanggalValuta, pokokPinjaman, bungaEfektif, caraBayarAngsuran);
    } else if (caraHitungAngsuran === 3) {
      console.log('Using SLIDING calculation');
      return this.SLIDING(jangkaWaktuThn, jangkaWaktuBln, tanggalValuta, pokokPinjaman, bungaEfektif, caraBayarAngsuran);
    }else {
      console.log('Using PAT calculation');
      return this.PAT(jangkaWaktuThn, jangkaWaktuBln, tanggalValuta, pokokPinjaman, bungaEfektif, caraBayarAngsuran);
    }
  }  
  PAT(
    jangkaWaktuThn: number,
    jangkaWaktuBln: number,
    tanggalValuta: string,
    pokokPinjaman: number,
    bungaEfektif: number,
    caraBayarAngsuran: number
  ) {
    const totalBulan = jangkaWaktuThn * 12 + jangkaWaktuBln;
    const result = [];
    let currentDate = new Date(tanggalValuta);
    let sisaPokok = pokokPinjaman;
    const bungaEfBln = bungaEfektif / 1200;
    let angsBln = Math.round((pokokPinjaman * bungaEfBln) / (1 - Math.pow(1 + bungaEfBln, -totalBulan)));
  
    let totalBunga = 0;
    let totalPokok = 0;
    let totalAngsuran = 0;
  
    for (let i = 0; i < totalBulan; i++) {
      currentDate.setMonth(currentDate.getMonth() + (i === 0 && caraBayarAngsuran === 2 ? 0 : 1));
      const formattedDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
      let bunga = Math.round(bungaEfBln * sisaPokok);
      let pokok = Math.round(angsBln - bunga);
      
      if (i === totalBulan - 1) {
        const ga = pokokPinjaman - totalPokok;
        const gap = ga - pokok;        
        pokok += gap;
        bunga -= gap;
        bunga = Math.max(bunga, 0);
        sisaPokok = 0;
        angsBln = bunga + pokok;
      } else {
        sisaPokok -= pokok;
      }
  
      totalBunga += bunga;
      totalPokok += pokok;
      totalAngsuran += angsBln;
  
      result.push({
        ke: String(i + 1).padStart(2, '0'),
        tanggal: formattedDate,
        bunga: bunga.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        pokok: pokok.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        totalAngsuran: angsBln.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        saldoAkhir: sisaPokok.toLocaleString('id-ID', { minimumFractionDigits: 0 })
      });
    }
  
    result.push({
      ke: '',
      tanggal: 'Total',
      bunga: totalBunga.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      pokok: totalPokok.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      totalAngsuran: totalAngsuran.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      saldoAkhir: ''
    });
  
    return result;
  }
  

  PPT(
    jangkaWaktuThn: number,
    jangkaWaktuBln: number,
    tanggalValuta: string,
    pokokPinjaman: number,
    bungaEfektif: number,
    caraBayarAngsuran: number
  ) {
    const totalBulan = jangkaWaktuThn * 12 + jangkaWaktuBln;
    const result = [];
    let currentDate = new Date(tanggalValuta);
    let sisaPokok = pokokPinjaman;
    const bungaEfHari = bungaEfektif / (360 * 100);
  
    let totalBunga = 0;
    let totalPokok = 0;
    let totalAngsuran = 0;
  
    for (let i = 0; i < totalBulan; i++) {
      currentDate.setMonth(currentDate.getMonth() + (i === 0 && caraBayarAngsuran === 2 ? 0 : 1));
      const formattedDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
      const daysInMonth = Math.round((currentDate.getTime() - new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()).getTime()) / (1000 * 60 * 60 * 24));
      let bunga = Math.round(bungaEfHari * sisaPokok * daysInMonth);
      let pokok = i === totalBulan - 1 ? sisaPokok : 0;
      sisaPokok -= pokok;
      
      if (i === totalBulan - 1) {
        sisaPokok = 0;
      }

      totalBunga += bunga;
      totalPokok += pokok;
      totalAngsuran += (pokok + bunga);
  
      result.push({
        ke: String(i + 1).padStart(2, '0'),
        tanggal: formattedDate,
        bunga: bunga.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        pokok: pokok.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        totalAngsuran: (pokok + bunga).toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        saldoAkhir: sisaPokok.toLocaleString('id-ID', { minimumFractionDigits: 0 })
      });
    }
  
    result.push({
      ke: '',
      tanggal: 'Total',
      bunga: totalBunga.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      pokok: totalPokok.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      totalAngsuran: totalAngsuran.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      saldoAkhir: ''
    });
  
    return result;
  }
  
  FLAT(
    jangkaWaktuThn: number,
    jangkaWaktuBln: number,
    tanggalValuta: string,
    pokokPinjaman: number,
    bungaEfektif: number,
    caraBayarAngsuran: number
  ) {
    const totalBulan = jangkaWaktuThn * 12 + jangkaWaktuBln;
    const result = [];
    let currentDate = new Date(tanggalValuta);
    let sisaPokok = pokokPinjaman;
    const bungaEfBln = bungaEfektif / 1200;
    
    // Initialize totals
    let totalBunga = 0;
    let totalPokok = 0;
    let totalAngsuran = 0;
    let angsBln = 0;
  
    for (let i = 0; i < totalBulan; i++) {
      currentDate.setMonth(currentDate.getMonth() + (i === 0 && caraBayarAngsuran === 2 ? 0 : 1));
      const formattedDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
      const bunga = Math.round(bungaEfBln * pokokPinjaman);
      let pokok;
  
      if (i === totalBulan - 1) {
        pokok = sisaPokok;
        sisaPokok = 0;
      } else {
        pokok = Math.round(pokokPinjaman / totalBulan);
        sisaPokok -= pokok;
      }
  
      // Accumulate totals
      totalBunga += bunga;
      totalPokok += pokok;
      totalAngsuran += pokok + bunga;
  
      result.push({
        ke: String(i + 1).padStart(2, '0'),
        tanggal: formattedDate,
        bunga: bunga.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        pokok: pokok.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        totalAngsuran: (pokok + bunga).toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        saldoAkhir: sisaPokok.toLocaleString('id-ID', { minimumFractionDigits: 0 })
      });
  
      if (i === totalBulan - 1) {
        angsBln = pokok + bunga;
      }
    }
  
    // Add totals to the result array
    result.push({
      ke: '',
      tanggal: 'Total',
      bunga: totalBunga.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      pokok: totalPokok.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      totalAngsuran: totalAngsuran.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      saldoAkhir: ''
    });
  
    return result;
  }
  
  SLIDING(
    jangkaWaktuThn: number,
    jangkaWaktuBln: number,
    tanggalValuta: string,
    pokokPinjaman: number,
    bungaEfektif: number,
    caraBayarAngsuran: number
  ) {
    const totalBulan = jangkaWaktuThn * 12 + jangkaWaktuBln;
    const result = [];
    let currentDate = new Date(tanggalValuta);
    let sisaPokok = pokokPinjaman;
    const bungaEfBln = bungaEfektif / 1200;
    
    // Initialize totals
    let totalBunga = 0;
    let totalPokok = 0;
    let totalAngsuran = 0;
  
    for (let i = 0; i < totalBulan; i++) {
      currentDate.setMonth(currentDate.getMonth() + (i === 0 && caraBayarAngsuran === 2 ? 0 : 1));
      const formattedDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
      const bunga = Math.round(bungaEfBln * sisaPokok);
      const pokok = i === totalBulan - 1 ? sisaPokok : Math.round(pokokPinjaman / totalBulan);
      sisaPokok -= pokok;
      
      // Accumulate totals
      totalBunga += bunga;
      totalPokok += pokok;
      totalAngsuran += pokok + bunga;
  
      result.push({
        ke: String(i + 1).padStart(2, '0'),
        tanggal: formattedDate,
        bunga: bunga.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        pokok: pokok.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        totalAngsuran: (pokok + bunga).toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        saldoAkhir: sisaPokok.toLocaleString('id-ID', { minimumFractionDigits: 0 })
      });
    }
  
    // Add totals to the result array
    result.push({
      ke: '',
      tanggal: 'Total',
      bunga: totalBunga.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      pokok: totalPokok.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      totalAngsuran: totalAngsuran.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
      saldoAkhir: ''
    });
  
    return result;
  }
  
}
