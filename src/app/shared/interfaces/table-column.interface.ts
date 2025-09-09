export interface ITableColumn {
  name: string;
  attribute?: string | number | boolean;
  description?: string;
  isQuill?: boolean;
  jsonParse?: boolean;
  isProminent?: boolean;
  isStatus?: boolean;
  isDate?: boolean;
  isBadge?: boolean;
}
