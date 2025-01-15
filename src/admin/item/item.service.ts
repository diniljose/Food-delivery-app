import { BadRequestException, Injectable } from '@nestjs/common';
import {  ItemDetailsDto } from './dto/create-item.dto';
import { ResponseService } from 'src/services/response/response.service';
import { FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ItemService {
  constructor(private readonly responseService: ResponseService,){}


  async addItem(itemDetailsDto: ItemDetailsDto): Promise<any> {
    try {
 

      
    } catch (error) {
      // Handle errors
      this.responseService.handleErrorservice(error);
      throw error; // Rethrow after handling to ensure the error is properly logged or propagated
    }
  }

  async uploadFile(bufferData: Buffer, fileName: string): Promise<{ fileUrl: string }> {
    try {
      // Define the upload directory in the project root
      const uploadsDir = path.join(__dirname, '../../../uploads');
  
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true }); // Create parent folders if necessary
      }
  
      // Define the full file path
      const filePath = path.join(uploadsDir, fileName);
  
      // Save the file to the specified path
      await fs.promises.writeFile(filePath, bufferData);
  
      // Return the file URL
      return {
        fileUrl: `/uploads/${fileName}`, // Use relative path for serving
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
  






  findAll() {
    return `This action returns all item`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

 

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
