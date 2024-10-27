import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encodeUri',
  standalone: true,
})
export class EncodeUriPipe implements PipeTransform {
  public transform(value: string): string {
    return encodeURI(value);
  }
}
