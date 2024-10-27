import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorByFirstChar',
  standalone: true,
})
export class ColorByFirstCharacterPipe implements PipeTransform {
  public transform(value: string): string {
    return '#' + ((((1 << 24) * value.charCodeAt(0)) / 100) | 0).toString(16).padStart(6, '0');
  }
}
