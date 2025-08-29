import * as XLSX from 'xlsx';

export interface ExcelData {
  [key: string]: any;
}

export const parseExcelFile = (file: File): Promise<{ data: ExcelData[]; columns: string[]; fileName: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          throw new Error('No data found in the Excel file');
        }
        
        // Extract headers and data
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1).filter(row => 
          Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '')
        );
        
        // Convert rows to objects
        const processedData: ExcelData[] = rows.map((row: any[]) => {
          const obj: ExcelData = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] ?? null;
          });
          return obj;
        });
        
        resolve({
          data: processedData,
          columns: headers,
          fileName: file.name
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsBinaryString(file);
  });
};