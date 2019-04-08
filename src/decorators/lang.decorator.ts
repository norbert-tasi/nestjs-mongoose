import { createParamDecorator } from '@nestjs/common';

export const Lang = createParamDecorator((data, req) => {
    return req.user.lang;
});
