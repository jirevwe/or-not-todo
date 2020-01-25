import { BaseController } from '../base';
import {
  controller,
  httpPost,
  request,
  response,
  requestBody,
  httpGet,
  requestParam,
  httpDelete,
  queryParam
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { CreateTaskPayload, TaskRepo } from '@app/data/task';

@controller('/tasks')
export class TaskContoller extends BaseController {
  @httpPost('/')
  async createTask(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: CreateTaskPayload
  ) {
    try {
      this.handleSuccess(req, res, await TaskRepo.create(body));
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet('/:id')
  async getTask(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: string
  ) {
    try {
      this.handleSuccess(req, res, await TaskRepo.byID(id));
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost('/:id')
  async updateTask(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: string,
    @requestBody() update: CreateTaskPayload
  ) {
    try {
      this.handleSuccess(
        req,
        res,
        await TaskRepo.updateWithOperators(id, { $set: update })
      );
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete('/:id')
  async deleteTask(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: string
  ) {
    try {
      this.handleSuccess(req, res, await TaskRepo.remove(id));
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet('/')
  async getTaskByDay(
    @request() req: Request,
    @response() res: Response,
    @queryParam() query: any
  ) {
    try {
      const daysTask = await TaskRepo.getTasks(query);
      this.handleSuccess(req, res, daysTask);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
