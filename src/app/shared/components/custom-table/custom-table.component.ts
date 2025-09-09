import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ITableColumn } from '@main-module/app/shared/interfaces/table-column.interface';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-custom-table-data',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DividerModule],
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
  @Input() lazy: boolean = false;
  @Input() selectableRow: boolean = false;
  @Input() canDelete: boolean = true;
  @Input() canCreate: boolean = true;
  @Input() canSearch: boolean = true;
  @Input() canUpdate: boolean = false;
  @Input() canTree: boolean = false;
  @Input() canView: boolean = false;
  @Input() actions: boolean = true;
  @Input() isPaginator: boolean = true;
  @Input() canDivider: boolean = true;
  @Input() IsProminent: boolean = false;

  @Output() onCreate = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @Output() onTree = new EventEmitter<any>();
  @Output() onLazyLoad = new EventEmitter<LazyLoadEvent>();

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    if (this.canUpdate === false && this.canDelete === false) {
      this.actions = false;
    }
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  jsonParse(content: Object): string {
    return JSON.stringify(content);
  }

  applyGlobalFilter(event: any, isEnter: boolean = false) {
    const value = event.target.value;
    if (isEnter && (value.length >= 3 || value.length === 0)) {
      this.onLazyLoad.emit({
        filters: { global: value },
      });
    }
  }

  applyColumnFilter(event: any, field: string) {
    const value = event.target.value;
    if (value.length >= 3 || value.length === 0) {
      const filters = { [field]: { value: value, matchMode: 'contains' } };
      this.onLazyLoad.emit({ filters });
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }

  loadLazyData(event: LazyLoadEvent) {
    if (this.lazy) {
      this.onLazyLoad.emit(event);
    }
  }

  rowSelected(event: any) {
    this.onRowSelect.emit(event.data);
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
}
