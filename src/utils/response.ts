import { Request, Response } from "express";
import { LoggerService } from "../logger";

const SUCCESS_CODE = 0;
const ERROR_CODE = 1;
const NOT_FOUND_CODE = 2;
const BAD_REQUEST_CODE = 3;
export const successResponse = (
  res: Response,
  data: any,
  message = "Success"
) => {
  return res.status(200).send({
    code: SUCCESS_CODE,

    success: true,
    message,
    data,
  });
};

export const successCreateRes = (
  res: Response,
  data: any,
  message = "Success"
) => {
  return res.status(201).send({
    code: SUCCESS_CODE,

    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: Response, error: any, message = "Error") => {
  LoggerService.error(error);

  return res.status(500).send({
    code: ERROR_CODE,

    success: false,
    message,
    error,
  });
};

export const notFoundResponse = (res: Response, message = "Not Found") => {
  return res.status(404).send({
    code: NOT_FOUND_CODE,

    success: false,
    message,
  });
};

export const badRequestResponse = (
  res: Response,
  error: any,
  message = "Bad Request"
) => {
  LoggerService.error(error);
  return res.status(400).send({
    code: BAD_REQUEST_CODE,
    success: false,
    message,
    error,
  });
};
