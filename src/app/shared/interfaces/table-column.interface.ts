export interface ITableColumn {
  name: string;
  attribute?: string | number | boolean;

  filterable?: boolean;
  filterType?: 'text' | 'select' | 'multiselect';
  filterOptions?: { label: string; value: any }[];
  matchMode?: 'contains' | 'equals' | 'in';
  filterField?: string;
  description?: string;
  isQuill?: boolean;
  jsonParse?: boolean;
  isProminent?: boolean;
  isStatus?: boolean;
  isDate?: boolean;
  isBadge?: boolean;

  valueMapper?: (row: any) => any;
}
