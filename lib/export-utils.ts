// Utility functions for exporting data to CSV

export function convertToCSV(data: any[], headers: string[]): string {
  if (data.length === 0) return '';

  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape values that contain commas or quotes
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportInventoryToCSV(items: any[]): void {
  const headers = [
    'productName',
    'serialNumber',
    'category',
    'quantity',
    'deliveryDate',
    'warrantyStartDate',
    'warrantyEndDate',
    'licenseEndDate',
    'serviceType',
    'serviceEndDate',
    'invoiceNumber',
    'challanNumber',
    'status'
  ];
  
  const csvContent = convertToCSV(items, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `inventory-export-${timestamp}.csv`);
}

export function exportDeliveriesToCSV(items: any[]): void {
  const headers = [
    'productName',
    'serialNumber',
    'quantity',
    'deliveryDate',
    'challanNumber',
    'invoiceNumber'
  ];
  
  const csvContent = convertToCSV(items, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `deliveries-export-${timestamp}.csv`);
}

export function exportTicketsToCSV(tickets: any[]): void {
  const headers = [
    'id',
    'subject',
    'category',
    'priority',
    'status',
    'warrantyStatus',
    'serviceStatus',
    'createdAt',
    'updatedAt'
  ];
  
  const csvContent = convertToCSV(tickets, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `tickets-export-${timestamp}.csv`);
}

export function exportRenewalsToCSV(renewals: any[]): void {
  const headers = [
    'productName',
    'serialNumber',
    'oldDate',
    'newDate',
    'renewedBy',
    'renewalDate'
  ];
  
  const csvContent = convertToCSV(renewals, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `renewals-export-${timestamp}.csv`);
}

// PDF Download Simulation Functions
export function downloadChallan(challanNumber: string, productName: string, serialNumber: string): void {
  // Simulate PDF download by creating a simple text file with challan details
  const challanContent = `
═══════════════════════════════════════════════════
              DELIVERY CHALLAN
═══════════════════════════════════════════════════

Challan Number: ${challanNumber}
Date: ${new Date().toLocaleDateString()}

Product Details:
- Product Name: ${productName}
- Serial Number: ${serialNumber}

Company: SATMZ Distribution
Address: Mumbai, India

This is a computer-generated document.
No signature required.

═══════════════════════════════════════════════════
  `;
  
  const blob = new Blob([challanContent], { type: 'text/plain' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Challan-${challanNumber}.txt`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadInvoice(invoiceNumber: string, productName: string, serialNumber: string, quantity: number): void {
  // Simulate PDF download by creating a simple text file with invoice details
  const invoiceContent = `
═══════════════════════════════════════════════════
                   INVOICE
═══════════════════════════════════════════════════

Invoice Number: ${invoiceNumber}
Date: ${new Date().toLocaleDateString()}

Bill To:
Customer Account

Product Details:
- Product Name: ${productName}
- Serial Number: ${serialNumber}
- Quantity: ${quantity}
- Unit Price: ₹XX,XXX.00
- Total Amount: ₹XX,XXX.00

Payment Terms: Net 30 Days

Company: SATMZ Distribution
GSTIN: XXXXXXXXXXXXXXX
Address: Mumbai, India

This is a computer-generated document.

═══════════════════════════════════════════════════
  `;
  
  const blob = new Blob([invoiceContent], { type: 'text/plain' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Invoice-${invoiceNumber}.txt`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadReport(reportType: string): void {
  const timestamp = new Date().toISOString();
  const reportContent = `
═══════════════════════════════════════════════════
            ${reportType.toUpperCase()}
═══════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}

This is a sample ${reportType} report.
In a production environment, this would contain
detailed analytics and insights.

Company: SATMZ Distribution
Report Period: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════
  `;
  
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const filename = `${reportType.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
