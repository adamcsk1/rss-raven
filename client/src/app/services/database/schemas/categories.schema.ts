import { RxJsonSchema } from 'rxdb';

export const categoriesSchema: RxJsonSchema<any> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: 100,
    },
    hidden: {
      type: 'boolean',
    },
  },
  required: ['id', 'name', 'hidden'],
  indexes: ['hidden'],
};
