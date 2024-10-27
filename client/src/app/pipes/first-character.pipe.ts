import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstChar',
  standalone: true,
})
export class FirstCharacterPipe implements PipeTransform {
  public transform(value: string): string {
    return value.at(0) || '';
  }
}
