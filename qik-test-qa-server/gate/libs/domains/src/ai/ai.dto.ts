import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export namespace AiDTO {
    export class FileItem {
        @ApiProperty({ example: 'tests/test_login.py', description: 'Path to file inside repo' })
        @IsString()
        @IsNotEmpty()
        path: string;

        @ApiProperty({ example: 'def test_login(): ...', description: 'Content of the file' })
        @IsString()
        @IsNotEmpty()
        content: string;
    }

    export class Generate {
        @ApiProperty({
            description: 'OpenAPI Specification object',
            example: { openapi: '3.0.0', info: { title: 'Test' }, paths: {} }
        })
        @IsObject()
        @IsNotEmpty()
        spec: Record<string, any>;
    }

    export class Push {
        @ApiProperty({ type: [FileItem], description: 'List of files to commit' })
        @IsArray()
        @ValidateNested({ each: true })
        @Type(() => FileItem)
        files: FileItem[];

        @ApiProperty({ example: 'https://github.com/User/repo', description: 'Git repository URL' })
        @IsString()
        @IsNotEmpty()
        repo: string;

        @ApiProperty({ example: 'feature/new-tests', description: 'Branch name to create/update' })
        @IsString()
        @IsNotEmpty()
        branch: string;

        @ApiPropertyOptional({ example: 'main', default: 'main', description: 'Target branch for PR' })
        @IsString()
        @IsOptional()
        target_branch?: string = 'main';

        @ApiPropertyOptional({ example: 'Add AI generated tests', default: 'AI Commit', description: 'Commit message' })
        @IsString()
        @IsOptional()
        commit_message?: string = 'Add AI generated tests';

        @ApiPropertyOptional({ example: true, default: true, description: 'Create Pull Request' })
        @IsBoolean()
        @IsOptional()
        create_pr?: boolean = true;

        @ApiPropertyOptional({ example: false, default: false, description: 'Dry run (no changes)' })
        @IsBoolean()
        @IsOptional()
        dry_run?: boolean = false;
    }
}