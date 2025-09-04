import { ExcelData } from '../components/ExcelParser';

export interface DataSummary {
  totalRows: number;
  totalColumns: number;
  columnInfo: {
    [key: string]: {
      type: 'numeric' | 'text' | 'date' | 'boolean';
      nonNullCount: number;
      uniqueCount: number;
      sampleValues: any[];
      numericStats?: {
        min: number;
        max: number;
        mean: number;
        median: number;
        std: number;
      };
    };
  };
  sampleData: ExcelData[];
}

export interface QueryResult {
  description: string;
  data: any[];
  chartConfig?: any;
}

export class DataProcessor {
  private data: ExcelData[];

  constructor(data: ExcelData[]) {
    this.data = data;
  }

  // Generate comprehensive data summary for AI context
  generateSummary(sampleSize: number = 10): DataSummary {
    const summary: DataSummary = {
      totalRows: this.data.length,
      totalColumns: Object.keys(this.data[0] || {}).length,
      columnInfo: {},
      sampleData: this.data.slice(0, sampleSize)
    };

    // Analyze each column
    Object.keys(this.data[0] || {}).forEach(column => {
      const values = this.data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      const uniqueValues = [...new Set(values)];
      
      // Determine column type
      const isNumeric = values.every(val => !isNaN(Number(val)) && val !== '');
      const isDate = values.some(val => !isNaN(Date.parse(val)));
      const isBoolean = uniqueValues.every(val => ['true', 'false', '0', '1', 'yes', 'no'].includes(String(val).toLowerCase()));

      let type: 'numeric' | 'text' | 'date' | 'boolean' = 'text';
      if (isNumeric) type = 'numeric';
      else if (isBoolean) type = 'boolean';
      else if (isDate) type = 'date';

      summary.columnInfo[column] = {
        type,
        nonNullCount: values.length,
        uniqueCount: uniqueValues.length,
        sampleValues: uniqueValues.slice(0, 5)
      };

      // Add numeric statistics if applicable
      if (type === 'numeric') {
        const numericValues = values.map(Number);
        const sorted = numericValues.sort((a, b) => a - b);
        const sum = numericValues.reduce((a, b) => a + b, 0);
        const mean = sum / numericValues.length;
        
        summary.columnInfo[column].numericStats = {
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: mean,
          median: sorted[Math.floor(sorted.length / 2)],
          std: Math.sqrt(numericValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericValues.length)
        };
      }
    });

    return summary;
  }

  // Execute specific data queries locally
  executeQuery(queryType: string, params: any = {}): QueryResult {
    switch (queryType) {
      case 'filter':
        return this.filterData(params);
      case 'groupBy':
        return this.groupByColumn(params);
      case 'sort':
        return this.sortData(params);
      case 'aggregate':
        return this.aggregateData(params);
      case 'correlation':
        return this.calculateCorrelation(params);
      case 'topN':
        return this.getTopN(params);
      default:
        return { description: 'Unknown query type', data: [] };
    }
  }

  private filterData(params: { column: string; operator: string; value: any }): QueryResult {
    const { column, operator, value } = params;
    let filteredData = this.data;

    switch (operator) {
      case 'equals':
        filteredData = this.data.filter(row => row[column] == value);
        break;
      case 'greater':
        filteredData = this.data.filter(row => Number(row[column]) > Number(value));
        break;
      case 'less':
        filteredData = this.data.filter(row => Number(row[column]) < Number(value));
        break;
      case 'contains':
        filteredData = this.data.filter(row => String(row[column]).toLowerCase().includes(String(value).toLowerCase()));
        break;
    }

    return {
      description: `Filtered ${filteredData.length} rows where ${column} ${operator} ${value}`,
      data: filteredData.slice(0, 100) // Limit for display
    };
  }

  private groupByColumn(params: { column: string; aggregateColumn?: string; aggregateFunction?: string }): QueryResult {
    const { column, aggregateColumn, aggregateFunction = 'count' } = params;
    const groups: { [key: string]: any[] } = {};

    this.data.forEach(row => {
      const key = row[column];
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    const result = Object.entries(groups).map(([key, items]) => {
      const groupResult: any = { [column]: key, count: items.length };
      
      if (aggregateColumn && aggregateFunction !== 'count') {
        const values = items.map(item => Number(item[aggregateColumn])).filter(val => !isNaN(val));
        switch (aggregateFunction) {
          case 'sum':
            groupResult[`${aggregateFunction}_${aggregateColumn}`] = values.reduce((a, b) => a + b, 0);
            break;
          case 'avg':
            groupResult[`${aggregateFunction}_${aggregateColumn}`] = values.reduce((a, b) => a + b, 0) / values.length;
            break;
          case 'max':
            groupResult[`${aggregateFunction}_${aggregateColumn}`] = Math.max(...values);
            break;
          case 'min':
            groupResult[`${aggregateFunction}_${aggregateColumn}`] = Math.min(...values);
            break;
        }
      }
      
      return groupResult;
    });

    return {
      description: `Grouped by ${column} with ${aggregateFunction}${aggregateColumn ? ` of ${aggregateColumn}` : ''}`,
      data: result
    };
  }

  private sortData(params: { column: string; direction: 'asc' | 'desc' }): QueryResult {
    const { column, direction } = params;
    const sorted = [...this.data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return {
      description: `Sorted by ${column} in ${direction}ending order`,
      data: sorted.slice(0, 100)
    };
  }

  private aggregateData(params: { column: string; functions: string[] }): QueryResult {
    const { column, functions } = params;
    const values = this.data.map(row => Number(row[column])).filter(val => !isNaN(val));
    
    const result: any = {};
    functions.forEach(func => {
      switch (func) {
        case 'count':
          result.count = values.length;
          break;
        case 'sum':
          result.sum = values.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          result.average = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'max':
          result.maximum = Math.max(...values);
          break;
        case 'min':
          result.minimum = Math.min(...values);
          break;
      }
    });

    return {
      description: `Aggregated statistics for ${column}`,
      data: [result]
    };
  }

  private calculateCorrelation(params: { column1: string; column2: string }): QueryResult {
    const { column1, column2 } = params;
    const pairs = this.data
      .map(row => [Number(row[column1]), Number(row[column2])])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));

    if (pairs.length === 0) {
      return { description: 'No valid numeric pairs found', data: [] };
    }

    const n = pairs.length;
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0);

    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return {
      description: `Correlation between ${column1} and ${column2}`,
      data: [{ 
        column1, 
        column2, 
        correlation: correlation || 0,
        sampleSize: n 
      }]
    };
  }

  private getTopN(params: { column: string; n: number; sortBy?: string }): QueryResult {
    const { column, n, sortBy = column } = params;
    const grouped = this.groupByColumn({ column });
    const sorted = grouped.data.sort((a, b) => b[sortBy] - a[sortBy]);

    return {
      description: `Top ${n} values in ${column}`,
      data: sorted.slice(0, n)
    };
  }
}