import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { AiDTO } from '@domains';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
    constructor(
        @Inject('AI_API_NATS_SERVERS') private readonly aiClient: ClientProxy,
    ) {}

    async generate(dto: AiDTO.Generate) {
        const payload = {
            request_id: `req-${uuidv4()}`,
            spec: dto.spec,
            callback_subject: `ai.responses.gen.${uuidv4()}`
        };

        return firstValueFrom(
            this.aiClient.send('ai.generate_tests', payload)
        );
    }

    async push(dto: AiDTO.Push) {
        const payload = {
            request_id: `cicd-${uuidv4()}`,
            files: dto.files,
            repo: dto.repo,
            branch: dto.branch,
            target_branch: dto.target_branch ?? 'main',
            commit_message: dto.commit_message ?? 'Add AI generated tests',
            create_pr: dto.create_pr ?? true,
            dry_run: dto.dry_run ?? false,
            callback_subject: `ai.responses.cicd.${uuidv4()}`
        };

        return firstValueFrom(
            this.aiClient.send('ai.cicd.commit_push', payload)
        );
    }
}