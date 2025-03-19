import {Component, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import {Observable, take} from 'rxjs';
import {KeyValue} from '@angular/common';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  templateUrl: './auto-complete.component.html',
  imports: [
    AutoComplete,
    FormsModule,
  ],
  styleUrl: './auto-complete.component.scss'
})
export class AutoCompleteComponent {
  @Output() selectedItemChange = new EventEmitter<string>();

  @Input() searchMethod!: (text: string) => Observable<{ key: string; value: string }[]>;
  @Input() minSearchLength = 1;

  items: WritableSignal<{ key: string; value: string }[]> = signal([]);

  selectedItem?: KeyValue<string, string>;

  onSelect(item: KeyValue<string, string>) {
    this.selectedItem = item;
    this.selectedItemChange.emit(this.selectedItem?.key);
  }

  getItems(event: AutoCompleteCompleteEvent) {
    let text = event.query;
    if (!this.searchMethod || typeof this.searchMethod !== 'function') {
      console.warn('searchMethod не передано або це не функція!');
      return;
    }

    if (text.length >= this.minSearchLength)
      this.searchMethod(text).pipe(
        take(1)
      ).subscribe((items) => {
        this.items.set(items);
      });
    else
      this.items.set([]);
  }
}
