import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class RequestValidatorInterceptor implements NestInterceptor {
  private encryptionKey = process.env.ENCRYPTION_KEY;

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { body, url } = request;

    // Define your valid URLs
    const signInRoute = '/kuwaitVisa/portal/signIn';
    const authSignIn = '/kuwaitVisa/portal/authSignIn';
    const signUp = '/kuwaitVisa/portal/signUp';
    const authSignUp = '/kuwaitVisa/portal/authSignUp';
    const verifyOTP = '/kuwaitVisa/portal/verifyOTP';
    const verifyOTPSignUp = '/kuwaitVisa/portal/verifyOTPSignUp';
    const forgotPassword = '/kuwaitVisa/portal/forgotPassword';
    const createApplication = '/kuwaitVisa/portal/createApplication';
    const paymentVerification = '/kuwaitVisa/portal/payment/verification';
    const initiateTrackNumber =
      '/kuwaitVisa/portal/payment/initiateTrackNumber';
    const updateMobileNumber = '/kuwaitVisa/portal/updateMobileNumber';
    const downloadVisa = '/kuwaitVisa/portal/downloadVisa';
    const addRelations = '/kuwaitVisa/portal/addRelations';
    const checkPassport = '/kuwaitVisa/portal/checkPassport';

    const validUrls = [
      signInRoute,
      authSignIn,
      signUp,
      authSignUp,
      verifyOTP,
      verifyOTPSignUp,
      forgotPassword,
      initiateTrackNumber,
      paymentVerification,
      updateMobileNumber,
      downloadVisa,
      checkPassport,
    ];

    const formValidUrls = [createApplication, addRelations];

    // If the URL matches any of the valid routes for payload decryption
    if (validUrls.includes(url)) {
      if (body?.payload) {
        // Decrypt the payload if exists
        context.switchToHttp().getRequest().body = await this.decryptData(
          body['payload'],
        );
      } else {
        throw new BadRequestException(
          this.sendErrorResponse(
            'Expected encrypted payload',
            'الحمولة المشفرة المتوقعة',
            {},
          ),
        );
      }

      const now = Date.now();
      return next.handle(); // Continue the request pipeline
    }
    // If the URL matches any of the routes for form data
    else if (formValidUrls.includes(url)) {
      if (body?.visaAppDetails) {
        const data = JSON.parse(body.visaAppDetails);
        if (data.payload) {
          // Decrypt visaAppDetails payload if exists
          body.visaAppDetails = await this.decryptData(data['payload']);
        }

        else {
          throw new BadRequestException(
            this.sendErrorResponse(
              'Expected encrypted payload',
              'الحمولة المشفرة المتوقعة',
              {},
            ),
          );
        }
      } else if (body?.relationDetails) {


        const data = JSON.parse(body.relationDetails);
        body.relationDetails = data;
        // if (data.payload) {
        //   // Decrypt visaAppDetails payload if exists
        //   body.relationDetails = await this.decryptData(data['payload']);
        // }

        // else {
        //   throw new BadRequestException(
        //     this.sendErrorResponse(
        //       'Expected encrypted payload',
        //       'الحمولة المشفرة المتوقعة',
        //       {},
        //     ),
        //   );
        // }
      } else {
        throw new BadRequestException(
          this.sendErrorResponse(
            'visaAppDetails is required.',
            'تفاصيل الطلب مطلوبة.',
            {},
          ),
        );
      }
    }

    return next.handle();
  }

  // Custom error response formatter
  sendErrorResponse(
    message: string,
    arabicMessage: string,
    responseObject: any,
  ) {
    return {
      code: 2,
      message: message,
      arabicMessage: arabicMessage,
      result: responseObject,
    };
  }

  async decryptData(encryptedData: string): Promise<object> {
    const combinedData = Buffer.from(encryptedData, 'base64');
    const iv = combinedData.slice(0, 12); // Extract the IV
    const encryptedText = combinedData.slice(12, combinedData.length - 16); // Encrypted text
    const authTag = combinedData.slice(combinedData.length - 16); // Auth tag

    const key = await this.generateKey(this.encryptionKey); // Generate a key from the encryptionKey

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    try {
      const decryptedData = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);

      const data = decryptedData.toString('utf8');

      // Check if data is valid JSON before parsing
      try {
        return JSON.parse(data);
      } catch (parseError) {
        throw new BadRequestException(
          this.sendErrorResponse(
            'Decrypted data is not valid JSON',
            'البيانات المفككة ليست JSON صالحًا',
            {},
          ),
        );
      }
    } catch (err) {
      throw new BadRequestException(
        this.sendErrorResponse('Decryption failed', 'فشل فك التشفير', {}),
      );
    }
  }

  private async generateKey(encryptionKey: string): Promise<Buffer> {
    const keyData = Buffer.from(encryptionKey, 'utf8');

    // Ensure the key is 256 bits (32 bytes)
    const hash = crypto.createHash('sha256').update(keyData).digest();

    return hash; // Return the 256-bit key
  }

}


