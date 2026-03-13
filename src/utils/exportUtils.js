import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Utility to convert image URL to Base64
 * @param {String} url 
 * @returns {Promise}
 */
const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } else {
                reject(new Error('Could not get canvas context'));
            }
        };
        img.onerror = (error) => reject(error);
        img.src = url;
    });
};

/**
 * Professional Export Utility for Categories
 * @param {Array} data - List of categories to export
 * @param {String} fileName - Desired file name (without extension)
 * @param {String} title - Table title for PDF
 */
export const exportCategories = (data, fileName, title) => {
    return {
        excel: () => {
            const worksheetData = data.map((item, index) => ({
                'SI No': index + 1,
                'Category ID': item.id,
                'Category Image URL': item.image || 'N/A',
                'Category Name': item.name
            }));

            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

            const wscols = [
                { wch: 8 },  // SI No
                { wch: 30 }, // Category ID
                { wch: 60 }, // Category Image
                { wch: 40 }  // Category Name
            ];
            worksheet['!cols'] = wscols;

            XLSX.writeFile(workbook, `${fileName}.xlsx`);
        },
        pdf: async () => {
            const doc = new jsPDF('p', 'mm', 'a4');
            const primaryColor = [225, 91, 101]; // #E15B65

            // --- PREMIUM HEADER ---
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text(title.toUpperCase(), 15, 25);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`REPORT GENERATED ON: ${new Date().toLocaleString().toUpperCase()}`, 15, 33);

            // --- DATA PREPARATION (WITH IMAGES) ---
            const body = [];
            const imagesMap = {};

            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (item.image) {
                    try {
                        const imgBase64 = await getBase64ImageFromURL(item.image);
                        imagesMap[i] = imgBase64;
                    } catch (e) {
                        console.warn('Failed to load image for PDF:', item.image);
                    }
                }
                body.push([i + 1, item.id, '', item.name]);
            }

            autoTable(doc, {
                startY: 50,
                head: [['SI NO', 'CATEGORY ID', 'IMAGE', 'CATEGORY NAME']],
                body: body,
                headStyles: {
                    fillColor: primaryColor,
                    textColor: [255, 255, 255],
                    fontSize: 11,
                    fontStyle: 'bold',
                    halign: 'center',
                    valign: 'middle',
                    minCellHeight: 12
                },
                bodyStyles: {
                    fontSize: 10,
                    valign: 'middle',
                    minCellHeight: 25
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 15 },
                    1: { halign: 'left', cellWidth: 50 },
                    2: { halign: 'center', cellWidth: 40 },
                    3: { halign: 'left' }
                },
                alternateRowStyles: { fillColor: [254, 248, 248] },
                didDrawCell: (cellData) => {
                    if (cellData.section === 'body' && cellData.column.index === 2) {
                        const imgBase64 = imagesMap[cellData.row.index];
                        if (imgBase64) {
                            const padding = 2;
                            doc.addImage(
                                imgBase64,
                                'PNG',
                                cellData.cell.x + padding,
                                cellData.cell.y + padding,
                                cellData.cell.width - (padding * 2),
                                cellData.cell.height - (padding * 2)
                            );
                        }
                    }
                },
                margin: { left: 15, right: 15 }
            });

            // --- FOOTER ---
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.setTextColor(150);
                doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
                doc.text('© BookMyEvent - Premium Professional Report', 15, 285);
            }

            doc.save(`${fileName}.pdf`);
        }
    };
};
