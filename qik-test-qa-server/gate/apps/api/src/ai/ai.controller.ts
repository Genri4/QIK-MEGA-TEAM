import { Body } from '@nestjs/common';
import { ApplyHttpControllerContract, ApplyHttpMethodContract } from '@shared';
import { AiGenerateContract, AiPushContract, AiContract } from './contracts';
import { AiService } from './ai.service';
import { AiDTO } from '@domains';

@ApplyHttpControllerContract(AiContract)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApplyHttpMethodContract(AiGenerateContract)
  async generate(@Body() body: AiDTO.Generate) {
    return this.aiService.generate(body);
  }

  @ApplyHttpMethodContract(AiPushContract)
  async push(@Body() body: AiDTO.Push) {
    return this.aiService.push(body);
  }
}
