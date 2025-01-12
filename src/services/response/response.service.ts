import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Injectable()
export class ResponseService {


    sendSuccessResponse(responseObject) {
        return {
          code: 1,
          message: 'success',
          arabicMessage: 'نجاح',
          result: responseObject
        }
      }
    
      sendErrorResponse(message, arabicMessage, responseObject) {
        return {
          code: 2,
          message: message,
          arabicMessage: arabicMessage,
          result: responseObject
        }
      }
    
      handleError(res: FastifyReply, error: any, logMessage?: string): FastifyReply {
        // Map of known exception names to HTTP status codes
        const errorMap: { [key: string]: number } = {
          NotFoundException: HttpStatus.NOT_FOUND,
          BadRequestException: HttpStatus.BAD_REQUEST,
          ConflictException: HttpStatus.CONFLICT,
          UnauthorizedException: HttpStatus.UNAUTHORIZED,
        };
    
        // Check if the error has a status property, and use it if present
        const status = error.status || errorMap[error.name] || HttpStatus.INTERNAL_SERVER_ERROR;
    
        // Default messages for different HTTP status codes (English and Arabic)
        const defaultMessages: { [key: number]: { en: string, ar: string } } = {
          [HttpStatus.NOT_FOUND]: { en: 'Not Found Error', ar: 'لم يتم العثور على البيانات' },
          [HttpStatus.BAD_REQUEST]: { en: 'Bad Request Error', ar: 'خطأ في الطلب' },
          [HttpStatus.CONFLICT]: { en: 'Conflict Error', ar: 'خطأ في التعارض' },
          [HttpStatus.UNAUTHORIZED]: { en: 'Unauthorized Error', ar: 'المستخدم غير مصرح له' },
          [HttpStatus.INTERNAL_SERVER_ERROR]: { en: 'Internal Server Error', ar: 'خطأ داخلي في الخادم' },
        };
    
        // Construct the error message
        const errorMessage = `Error occurred: ${error?.response?.englishMessage || defaultMessages[status].en}`;
        const arabicMessage = `حدث خطأ: ${error?.response?.arabicMessage || defaultMessages[status].ar}`;
    
        // Send the error response
        return res.status(status).send(
          this.sendErrorResponse(errorMessage, arabicMessage, {
            data: [],
          }),
        );
      }
    
    
    
    
      // Usage example in a catch block
    
    
    
      handleErrorservice(error) {
        if (error instanceof NotFoundException || error.status === 404) {
          throw new NotFoundException({
            englishMessage: error?.response?.englishMessage || 'Resource not found',
            arabicMessage: error?.response?.arabicMessage || 'المورد غير موجود',
          });
        } else if (error instanceof BadRequestException || error.status === 400) {
          throw new BadRequestException({
            englishMessage: error?.response?.englishMessage || 'Bad request',
            arabicMessage: error?.response?.arabicMessage || 'طلب غير صالح',
          });
        } else if (error instanceof UnauthorizedException || error.status === 401) {
          throw new UnauthorizedException({
            englishMessage: error?.response?.englishMessage || 'Unauthorized access',
            arabicMessage: error?.response?.arabicMessage || 'دخول غير مصرح به',
          });
        } else if (error instanceof ForbiddenException || error.status === 403) {
          throw new ForbiddenException({
            englishMessage: error?.response?.englishMessage || 'Forbidden',
            arabicMessage: error?.response?.arabicMessage || 'ممنوع',
          });
        }
    
        // Handle MongoDB-specific errors
        else if (error.name === 'MongoServerError') {
          if (error.code === 11000) {
            throw new ConflictException({
              englishMessage: error?.response?.englishMessage || 'Duplicate key error',
              arabicMessage: error?.response?.arabicMessage || 'خطأ في مفتاح مكرر',
            });
          } else {
            throw new InternalServerErrorException({
              englishMessage: error?.response?.englishMessage || 'Database error',
              arabicMessage: error?.response?.arabicMessage || 'خطأ في قاعدة البيانات',
            });
          }
        }
    
        // Handle common JavaScript errors
        else if (error instanceof TypeError) {
          throw new BadRequestException({
            englishMessage: error?.message || 'Invalid input parameters provided. Please check the data format.',
            arabicMessage: error?.message || 'تم توفير معلمات إدخال غير صالحة. يرجى التحقق من تنسيق البيانات.',
          });
        } else if (error instanceof SyntaxError) {
          throw new BadRequestException({
            englishMessage: error?.message || 'Syntax error in request payload.',
            arabicMessage: error?.message || 'خطأ في الصياغة في بيانات الطلب.',
          });
        }
    
        // Generic fallback for all other errors
        else {
          throw new InternalServerErrorException({
            englishMessage: error?.response?.englishMessage || `${error.message}`,
            arabicMessage: error?.response?.arabicMessage || `حدث خطأ غير متوقع: ${error.message}`,
          });
        }
      }
    
}
