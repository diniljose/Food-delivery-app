import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, Res, BadRequestException } from '@nestjs/common';
import { ItemService } from './item.service';
import {  ItemDetailsDto } from './dto/create-item.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseService } from 'src/services/response/response.service';

@Controller()
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly responseService: ResponseService,
    ) {}


  @Post('addNewItem')
  async addApplicatRelations(
    @Body() body: ItemDetailsDto,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
   
      const data = await this.itemService.addItem(body);
      return res
        .status(HttpStatus.OK)
        .send(this.responseService.sendSuccessResponse({ data }));
    } catch (error) {
      return this.responseService.handleError(res, error);
    }
  }

  @Post('upload')
  async uploadFiles(@Req() req: any, @Res() res: FastifyReply) {
    try {
      // Extract the file from the request
      let { file: files } = req.body;
      
      if (!files || files.length === 0) {
        throw new BadRequestException('File data is missing');
      }
  
      // Handle case where file data is in JSON format
      if (!files[0]?.data) {
        files = JSON.parse(req.body.file);
      }
  
      // Decode file data
      files.forEach((file) => {
        file.data = Buffer.from(file.data, 'base64'); // Convert base64 to Buffer
      });
  
      // Save each file and collect URLs
      const fileUrls = await Promise.all(
        files.map((file) =>
          this.itemService.uploadFile(file.data, file.filename || `file_${Date.now()}.jpg`)
        )
      );
  
      // Respond with the uploaded file URLs
      return res.status(HttpStatus.OK).send({
        message: 'Files uploaded successfully',
        data: fileUrls,
      });
    } catch (error) {
      // Handle errors
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error uploading files',
        error: error.message,
      });
    }
  }
  

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
