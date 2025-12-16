import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

type Options = { isOptional?: boolean; each?: boolean };
export const IdField = (options?: Options) => {
  const isOptional = options?.isOptional || false;
  const isArray = options?.each || false;
  const decorators = [];

  if (isOptional) {
    decorators.push(ApiPropertyOptional({ type: String, isArray }), IsOptional());
  } else {
    decorators.push(ApiProperty({ type: String, isArray }), IsNotEmpty());
  }
  decorators.push(IsUUID(4, { each: isArray }));

  return applyDecorators(...decorators);
};
