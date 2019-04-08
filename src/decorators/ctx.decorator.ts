import { createParamDecorator } from '@nestjs/common';

export interface Context {
    user: string;
    lang: string;
    role: string;
}

export const Ctx = createParamDecorator((data, req) => {
    const user = req.session.user.username;
    const lang = req.session.user.lang;
    const role = req.session.user.role;
    return { user, lang, role } as Context;
});
