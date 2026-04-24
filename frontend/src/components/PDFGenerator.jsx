import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateRequisitionPDF = async (requisition, hodSignature = null) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  doc.setDrawColor(0, 0, 0);
  doc.rect(10, 10, 190, 277);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('NTPC Limited', 105, 25, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Chatti Bariatric Coal Mining Project', 105, 35, { align: 'center' });
  doc.text('(Human Resource Department)', 105, 42, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VEHICLE REQUISITION SLIP', 105, 55, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('(Exclusively for nearest Railway/Airport, i.e. Kodarma & Ranchi under Employee Welfare)', 105, 62, { align: 'center' });
  
  doc.setDrawColor(0, 0, 0);
  doc.line(15, 68, 195, 68);
  
  const tableData = [
    ['Name of Employee', requisition.employeeName || ''],
    ['Employee No. & Designation', `${requisition.employeeNo || ''} ${requisition.designation || ''}`],
    ['Vehicle required for', requisition.vehicleRequiredFor || ''],
    ['Journey Details', `${requisition.fromStation || ''} to ${requisition.toStation || ''}`],
    ['PNR Number', requisition.pnrNumber || ''],
    ['Journey undertaken by', requisition.journeyBy || ''],
    ['Vehicle Required on', requisition.vehicleRequiredDate ? new Date(requisition.vehicleRequiredDate).toLocaleString() : 'N/A'],
    ['Vehicle Required at', requisition.vehicleRequiredAt || ''],
    ['Expected return time', requisition.expectedReturnTime ? new Date(requisition.expectedReturnTime).toLocaleString() : 'N/A'],
    ['Status', (requisition.status || 'PENDING').toUpperCase()],
    ['HOD Remarks', requisition.hodRemarks || 'N/A']
  ];
  
 autoTable(doc, {
    startY: 75,
    head: [['Field', 'Details']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
    headStyles: { fillColor: [0, 125, 197], textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' }, 1: { cellWidth: 130 } }
  });
  
  let finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Declaration:', 15, finalY);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const declaration = `I hereby undertake that the above detail is correct and in case anything contrary to above is found at any point of time, I will be fully held responsible for it and will be liable to action as per the Company's Rules.`;
  const splitDeclaration = doc.splitTextToSize(declaration, 180);
  doc.text(splitDeclaration, 15, finalY + 7);
  
  const signatureY = finalY + 35;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Signature of Employee', 30, signatureY);
  doc.setFont('helvetica', 'bold');
  doc.text(requisition.employeeName || '______________', 30, signatureY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 30, signatureY + 20);
  
  doc.text('Signature of HOD', 140, signatureY);
  
  if (hodSignature) {
    try {
      const img = new Image();
      img.src = `http://localhost:5000${hodSignature}`;
      await new Promise((resolve) => {
        img.onload = () => {
          doc.addImage(img, 'JPEG', 140, signatureY + 3, 40, 15);
          resolve();
        };
        img.onerror = () => {
          doc.setFont('helvetica', 'bold');
          doc.text('______________', 140, signatureY + 10);
          resolve();
        };
      });
    } catch(e) {
      doc.setFont('helvetica', 'bold');
      doc.text('______________', 140, signatureY + 10);
    }
  } else {
    doc.setFont('helvetica', 'bold');
    doc.text('______________', 140, signatureY + 10);
  }
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a computer generated requisition slip.', 105, 280, { align: 'center' });
  
  doc.save(`Vehicle_Requisition_${requisition.id || requisition._id || Date.now()}.pdf`);
};

export default generateRequisitionPDF;