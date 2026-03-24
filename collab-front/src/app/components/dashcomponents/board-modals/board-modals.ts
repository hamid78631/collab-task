import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardDTO } from '../../../models/board.model';

@Component({
  selector: 'app-board-modals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board-modals.html',
  styleUrls: ['./board-modals.css']
})
export class BoardModalsComponent {
  @Input() showModal = false;
  @Input() showEditModal = false;
  @Input() showDeleteConfirm = false;
  @Input() newBoard = { title: '', backgroundColor: '' };
  @Input() editBoard = { title: '', backgroundColor: '' };
  @Input() nameError = false;
  @Input() editNameError = false;

  @Output() create = new EventEmitter<void>();
  @Output() saveEdit = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() closeEdit = new EventEmitter<void>();
  @Output() closeDelete = new EventEmitter<void>();
  @Output() nameErrorChange = new EventEmitter<boolean>();
  @Output() editNameErrorChange = new EventEmitter<boolean>();

  readonly colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'];

  onBackdropClick(event: MouseEvent, type: 'create' | 'edit' | 'delete'): void {
    const target = event.target as HTMLElement;
    const classMap = { create: 'mbackdrop', edit: 'mbackdrop-edit', delete: 'mbackdrop-delete' };
    if (target.classList.contains(classMap[type])) {
      if (type === 'create') this.closeModal.emit();
      if (type === 'edit') this.closeEdit.emit();
      if (type === 'delete') this.closeDelete.emit();
    }
  }
}
