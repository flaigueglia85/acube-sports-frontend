import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

export interface RawOrderItem {
  name: string;
  quantity: number;
  total: string;
  image?: string; // base64 dal backend
}

export interface RawOrderData {
  id: number;
  status: string;
  date: string;
  total: string;
  items: RawOrderItem[];
  customer_name?: string;
  customer_email?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderPdfService {
  private async getLogoBase64(): Promise<string> {
    const res = await fetch('/assets/logo-acube.svg');
    const svgText = await res.text();

    return new Promise((resolve) => {
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          resolve(pngDataUrl);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }

  async generate(order: RawOrderData) {
    const logo = await this.getLogoBase64();

    const normalizedItems = order.items.map(i => ({
      name: i.name,
      quantity: i.quantity,
      price: parseFloat(i.total) / i.quantity,
      subtotal: parseFloat(i.total),
      image: i.image && i.image.startsWith('data:image/')
        ? i.image
        : null
    }));

    const bodyRows: any[] = [
      [
        { text: 'Prodotto', style: 'tableHeader', fillColor: '#f2f2f2' },
        { text: 'Quantità', style: 'tableHeader', fillColor: '#f2f2f2' },
        { text: 'Prezzo', style: 'tableHeader', fillColor: '#f2f2f2' },
        { text: 'Subtotale', style: 'tableHeader', fillColor: '#f2f2f2' }
      ]
    ];

    normalizedItems.forEach(i => {
      const productCell = i.image
        ? { columns: [{ image: i.image, width: 35 }, { text: i.name, margin: [5, 0, 0, 0] }] }
        : i.name;

      bodyRows.push([
        productCell,
        { text: i.quantity.toString(), alignment: 'center' },
        { text: `${i.price.toFixed(2)} €`, alignment: 'right' },
        { text: `${i.subtotal.toFixed(2)} €`, alignment: 'right' }
      ]);
    });

    const docDefinition: any = {
      content: [
        // HEADER ELEGANTE
        {
          columns: [
            { image: logo, width: 120 },
            [
              { text: 'Fattura / Ordine', style: 'title', alignment: 'right' },
              { text: `#${order.id}`, style: 'orderId', alignment: 'right' },
              { text: `Data: ${order.date}`, alignment: 'right' },
              { text: `Stato: ${order.status}`, alignment: 'right' }
            ]
          ]
        },
        { text: '', margin: [0, 15] },

        // DATI CLIENTE + ORDINE
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'Dati Cliente', style: 'sectionHeader' },
                { text: order.customer_name || '—' },
                { text: order.customer_email || '—' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'Dettagli Ordine', style: 'sectionHeader' },
                { text: `Ordine ID: ${order.id}` },
                { text: `Data: ${order.date}` },
                { text: `Stato: ${order.status}` }
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // TABELLA PRODOTTI
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Prodotto', style: 'tableHeader' },
                { text: 'Quantità', style: 'tableHeader' },
                { text: 'Prezzo', style: 'tableHeader' },
                { text: 'Subtotale', style: 'tableHeader' }
              ],
              ...order.items.map(i => [
                i.image
                  ? { columns: [{ image: i.image, width: 40 }, { text: i.name, margin: [5, 0, 0, 0] }] }
                  : i.name,
                { text: i.quantity.toString(), alignment: 'center' },
                { text: `${(parseFloat(i.total) / i.quantity).toFixed(2)} €`, alignment: 'right' },
                { text: `${parseFloat(i.total).toFixed(2)} €`, alignment: 'right' }
              ])
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#330f65' : rowIndex % 2 === 0 ? '#f9f9f9' : null,
            hLineColor: () => '#ddd',
            vLineColor: () => '#ddd'
          }
        },

        // TOTALE
        {
          alignment: 'right',
          margin: [0, 20, 0, 0],
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                { text: 'Totale', bold: true, border: [false, false, false, false] },
                { text: `${parseFloat(order.total).toFixed(2)} €`, bold: true, fillColor: '#f2f2f2' }
              ]
            ]
          },
          layout: 'noBorders'
        }
      ],
      footer: (currentPage: number, pageCount: number) => {
        return {
          text: `Acube Sports - P.IVA 123456789 - www.acube-sports.com  |  Pagina ${currentPage} di ${pageCount}`,
          alignment: 'center',
          fontSize: 9,
          margin: [0, 10, 0, 0],
          color: '#777'
        };
      },
      styles: {
        title: { fontSize: 20, bold: true, color: '#330f65' },
        orderId: { fontSize: 14, bold: true },
        sectionHeader: { bold: true, margin: [0, 0, 0, 5], color: '#330f65' },
        tableHeader: { bold: true, fontSize: 11, color: 'white', fillColor: '#330f65' }
      },
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10
      }
    };

    pdfMake.createPdf(docDefinition).download(`ordine-${order.id}.pdf`);
  }
}
