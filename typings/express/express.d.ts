import jSend from 'jsend';

declare global {
  namespace Express {
    export interface Request {
      user: any;
      id: string;
    }

    export interface Response {
      body: any;
      jSend: jSend;
    }
  }
}
