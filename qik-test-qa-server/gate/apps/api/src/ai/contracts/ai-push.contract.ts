import { ApiProperty } from '@nestjs/swagger';
import { ApiSchemaName, HttpContractData, HttpResponseBody } from '@shared';
import { AiContract } from './ai.contact';
import { AiDTO } from '@domains';

export namespace AiPushContract {
    export const method = HttpContractData.Method.Post;
    export const path = '/push';
    export const name = 'Push';
    export const description = 'Pushes generated tests to repository';

    @ApiSchemaName(`${AiContract.name}${name}RequestBody`)
    export class RequestBody extends AiDTO.Push {}

    @ApiSchemaName(`${AiContract.name}${name}ResponsePayload`)
    export class ResponsePayload {
        @ApiProperty({ description: 'Result of the git operation' })
        status: string;

        @ApiProperty({ required: false })
        pr_url?: string;
    }

    export const ResponseBody = HttpResponseBody(ResponsePayload);
}