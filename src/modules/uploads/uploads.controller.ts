import { multerOptions } from '@config/multer.config';
import {
  Controller,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { AuthenticatedRequest } from '@interfaces/request.interface';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @UseGuards(AuthGuard())
  @Post('photo')
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new HttpException(
        'Por favor, envie uma imagem',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const photoUrl = file.path.replace('uploads\\', '/').replace(/\\/g, '/');
      await this.uploadsService.uploadPhoto(req.user.id, photoUrl);
      return { photoUrl };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Erro interno do servidor',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
