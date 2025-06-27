import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
    @ApiProperty({
        description: 'The session ID',
        example: 'asdasdasd'
    })
    public sid: string;
}