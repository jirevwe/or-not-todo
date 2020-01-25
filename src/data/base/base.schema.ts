import { SchemaDefinition, SchemaOptions, Schema, SchemaTypes } from 'mongoose';

import { uuid, readMapper, timestamps } from '.';

export const SchemaFactory = (
  schemaFields: SchemaDefinition,
  options?: SchemaOptions,
) => {
  if (!schemaFields || Object.keys(schemaFields).length === 0) {
    throw new Error('Please specify schemaFields');
  }

  return new Schema(
    {
      ...schemaFields,
      _id: { ...uuid, required: true },
      deleted_at: { type: SchemaTypes.Date },
    },
    {
      ...options,
      ...readMapper,
      ...timestamps,
      // @ts-ignore
      selectPopulatedPaths: false,
    },
  );
};
