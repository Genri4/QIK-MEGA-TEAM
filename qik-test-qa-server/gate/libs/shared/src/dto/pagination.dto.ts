import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiSchemaName } from '@shared';

export namespace PaginationDTO {
  @ApiSchemaName('PaginationRequestDTO')
  export class Request {
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page: number = 1;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit: number = 10;
  }

  @ApiSchemaName('PaginationResponseDTO')
  export class Response {
    @ApiProperty({ description: 'Total count of pages' })
    @IsInt()
    @Type(() => Number)
    page: number;
    @ApiProperty({ description: 'Total count of pages' })
    @IsInt()
    @Type(() => Number)
    total_pages: number;
    @ApiProperty({ description: 'Count of items on page' })
    @IsInt()
    @Type(() => Number)
    items_count: number;
    @ApiProperty({ description: 'Flag if page is the last one' })
    @IsBoolean()
    is_last_page: boolean;
  }
}
