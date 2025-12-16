import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@systems';

import { Data } from '../data';

export const ApplyHttpControllerContract = (contract: Data.ControllerContract) => {
  const decorators: ClassDecorator[] = [ApiTags(contract.name), Controller(contract.path ?? ''), UseGuards(JwtGuard)];

  return applyDecorators(...decorators.filter(Boolean));
};
