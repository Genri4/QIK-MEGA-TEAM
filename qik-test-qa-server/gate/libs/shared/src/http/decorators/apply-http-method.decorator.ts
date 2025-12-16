import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { UseJWTGuard } from '@systems';

import { Data } from '../data';
import { Utility } from '../utility';

export const ApplyHttpMethodContract = (contract: Data.MethodContract) => {
  const decorators: MethodDecorator[] = [
    Utility.formMethodDecorator(contract?.method, contract?.path),
    ApiOperation({
      summary: contract?.name,
      description: contract?.description,
    }),
    contract?.ResponseBody &&
      ApiOkResponse({
        type: contract?.ResponseBody,
      }),
    contract?.jwt ? UseJWTGuard(contract.jwt) : null,
  ];

  return applyDecorators(...decorators.filter(Boolean));
};
