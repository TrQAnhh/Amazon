import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    use(req: Request & { rawBody?: Buffer }, res: Response, next: () => void) {
        bodyParser.raw({ type: 'application/json' })(req, res, (err) => {
            if (!err) req.rawBody = req.body;
            next();
        });
    }
}
