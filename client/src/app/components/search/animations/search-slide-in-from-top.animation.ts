import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export const searchSlideInFromTopAnimation: AnimationTriggerMetadata = trigger('searchSlideInFromTopAnimation', [
  transition(':enter', [style({ transform: 'translate3d(-50%,-150%,0)', opacity: 0 }), animate('0.2s', style({ transform: 'translate3d(-50%,25%,0)', opacity: 1 }))]),
  transition(':leave', [style({ transform: 'translate3d(-50%,25%,0)', opacity: 1 }), animate('0.2s', style({ transform: 'translate3d(-50%,-150%,0)', opacity: 0 }))]),
]);
