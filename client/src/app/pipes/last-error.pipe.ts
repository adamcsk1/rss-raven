import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastError',
  standalone: true,
})
export class LastErrorPipe implements PipeTransform {
  public transform(error: string): string {
    return error.replace(/\( (.*?) \)/gi, '').trim();
  }
}
