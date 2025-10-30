import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ITableColumn } from '@shared-module/interfaces/table-column.interface';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Menu, MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-custom-table-data',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DividerModule, SelectModule, MultiSelectModule, SplitButtonModule, MenuModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableDataComponent implements OnInit {
  @Input() columns: ITableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() title: string;

  @Input() subtitle: string;
  @Input() totalRecords: number = 0;
  @Input() rowsPerPage: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 20, 50];
  @Input() titleOff: boolean = true;
  @Input() lazy: boolean = false;
  @Input() selectableRow: boolean = false;
  @Input() canDelete: boolean = true;
  @Input() canCreate: boolean = true;
  @Input() canSearch: boolean = true;
  @Input() canUpdate: boolean = false;
  @Input() canSubtitle: boolean = true;
  @Input() canTree: boolean = false;
  @Input() canView: boolean = false;
  @Input() actions: boolean = true;
  @Input() isPaginator: boolean = true;
  @Input() canDivider: boolean = true;
  @Input() IsProminent: boolean = false;
  @Input() tableCard: boolean = true;
  @Input() createButtonLabel: string = 'Create';
  @Input() canSplitButton: boolean = false;
  @Input() splitButtonOptions: any[] = [];

  // 🔹 Nuevos inputs para acciones por fila
  @Input() showRowActions: boolean = false;
  @Input() rowActionsBuilder?: (row: any) => MenuItem[];
  @Input() actionsIcon: string = 'pi pi-ellipsis-v';
  @Input() actionsLabel: string | null = null;
  @Input() actionsColumnHeader: string = 'Acciones';

  @Output() onCreate = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onRowUnselect = new EventEmitter<any>();
  @Output() onDoubleClick = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @Output() onTree = new EventEmitter<any>();
  @Output() onLazyLoad = new EventEmitter<LazyLoadEvent>();
  @Output() onSplitButtonAction = new EventEmitter<any>();

  @ViewChild('rowActionMenu') rowActionMenu: Menu;
  currentRowMenu: MenuItem[] = [];
  currentRow: any | null = null;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    if (this.canUpdate === false && this.canDelete === false && this.canView === false && !this.showRowActions) {
      this.actions = false;
    }
    if (!this.subtitle && !this.title) this.canSubtitle = false;
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  jsonParse(content: Object): string {
    return JSON.stringify(content);
  }

  applyGlobalFilter(event: any, isEnter: boolean = false) {
    const value = event.target.value;
    if (isEnter && (value.length >= 2 || value.length === 0)) {
      this.onLazyLoad.emit({
        filters: { global: value },
      });
    }
  }

  applyColumnFilter(event: any, field: string, matchMode: string = 'contains') {
    let value: any;

    if (event.value !== undefined) {
      value = event.value;
    } else {
      value = event.target.value;
    }

    const filterKey = this.columns.find((c) => c.attribute === field)?.filterField || field;

    if ((Array.isArray(value) && value.length > 0) || (typeof value === 'string' && (value.length >= 1 || value.length === 0)) || value !== null) {
      const filters = { [filterKey]: { value, matchMode } };
      this.onLazyLoad.emit({ filters });
    }
  }

  getCellValue(row: any, column: ITableColumn): any {
    if (column.valueMapper) {
      try {
        return column.valueMapper(row);
      } catch {
        return undefined;
      }
    }
    if (typeof column.attribute === 'string') return this.getNestedValue(row, column.attribute);
    if (column.filterField && typeof column.filterField === 'string') return row?.[column.filterField];
    return undefined;
  }
  getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    const keys = path.match(/([^[.\]])+/g);
    return keys?.reduce((acc, key) => {
      if (acc === null || acc === undefined) return undefined;
      return acc[key];
    }, obj);
  }

  loadLazyData(event: LazyLoadEvent) {
    if (this.lazy) {
      this.onLazyLoad.emit(event);
    }
  }

  rowSelected(event: any) {
    this.onRowSelect.emit(event.data);
  }

  rowUnselected(event: any) {
    this.onRowUnselect.emit(event.data);
  }

  doubleClick(event: any) {
    this.onDoubleClick.emit(event);
  }

  create(event: any) {
    this.onCreate.emit(event);
  }

  update(event: any) {
    this.onUpdate.emit(event);
  }

  delete(event: any) {
    this.onDelete.emit(event);
  }

  view(event: any) {
    this.onView.emit(event);
  }

  tree(event: any) {
    this.onTree.emit(event);
  }

  splitButtonAction(event: any) {
    this.onSplitButtonAction.emit(event);
  }

  // 🔹 Abrir menú contextual por fila
  openRowActionMenu(event: MouseEvent, row: any) {
    if (!this.rowActionsBuilder) return;
    this.currentRow = row;
    this.currentRowMenu = this.rowActionsBuilder(row) || [];
    if (this.currentRowMenu.length > 0) {
      this.rowActionMenu.toggle(event);
    }
  }

  get hasColumnFilters(): boolean {
    return this.columns?.some((c) => c.filterable);
  }
}
