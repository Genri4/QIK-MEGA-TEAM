import { ApiProperty } from '@nestjs/swagger';
import { ApiSchemaName, HttpContractData, HttpResponseBody } from '@shared';
import { AiContract } from './ai.contact';
import { AiDTO } from '@domains';

export namespace AiGenerateContract {
    export const method = HttpContractData.Method.Post;
    export const path = '/generate'; // Исправлен путь
    export const name = 'Create';
    export const description = 'Generates tests based on OpenAPI spec';

    @ApiSchemaName(`${AiContract.name}${name}RequestBody`)
    export class RequestBody extends AiDTO.Generate {}

    @ApiSchemaName(`${AiContract.name}${name}ResponsePayload`)
    export class ResponsePayload {
        @ApiProperty({ description: 'Response from AI service' })
        content: string;
    }

    export const ResponseBody = HttpResponseBody(ResponsePayload);
}