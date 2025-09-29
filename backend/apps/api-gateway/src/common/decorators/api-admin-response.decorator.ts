import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

export function ApiAdminResponse(description: string) {
    return applyDecorators(
        ApiOkResponse({ description }),
        ApiUnauthorizedResponse({ description: 'Unauthenticated access' }),
        ApiForbiddenResponse({ description: 'Unauthorized access' }),
    );
}
