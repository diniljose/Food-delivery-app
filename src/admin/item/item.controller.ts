import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, Res, BadRequestException, Put } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemRequestDto, UpdateItemRequestDto } from './dto/create-item.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseService } from 'src/services/response/response.service';

@Controller()
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly responseService: ResponseService,
  ) { }

  @Post('createItem')
  async createItem(
    @Body() CreateItemDto: CreateItemRequestDto,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      const item = await this.itemService.createItem(CreateItemDto);
      return res.send(
        this.responseService.sendSuccessResponse({ item: 'Item created successfully' }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to create item',
          'فشل في إنشاء العنصر',
          error.message,
        ),
      );
    }
  }

  @Get('getAll')
  async getAllItems(@Res() res: FastifyReply): Promise<any> {
    try {
      const items = await this.itemService.getAllItems();
      return res.send(
        this.responseService.sendSuccessResponse({ data: items}),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to fetch items',
          'فشل في جلب العناصر',
          error.message,
        ),
      );
    }
  }

  @Get('getSingleItem/:id')
  async getItemById(
    @Param('id') itemId: string,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {

      console.log(itemId);
      
      const item = await this.itemService.getItemById(itemId);
      return res.send(
        this.responseService.sendSuccessResponse({ dataZ: item }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to fetch item',
          'فشل في جلب العنصر',
          error.message,
        ),
      );
    }
  }

  @Put('update/:id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() updateData: Partial<UpdateItemRequestDto>,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      const updatedItem = await this.itemService.updateItem(itemId, updateData);
      return res.send(
        this.responseService.sendSuccessResponse({ updatedItem: 'Item updated successfully' }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to update item',
          'فشل في تحديث العنصر',
          error.message,
        ),
      );
    }
  }

  @Delete('delete/:id')
  async deleteItem(
    @Param('id') itemId: string,
    @Res() res: FastifyReply,
  ): Promise<any> {
    try {
      await this.itemService.deleteItem(itemId);
      return res.send(
        this.responseService.sendSuccessResponse({ data: 'Item deleted successfully' }),
      );
    } catch (error) {
      return res.send(
        this.responseService.sendErrorResponse(
          'Failed to delete item',
          'فشل في حذف العنصر',
          error.message,
        ),
      );
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
