import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción para cuando MinIO no está disponible o no se puede conectar
 */
export class MinioConnectionException extends HttpException {
  constructor(endpoint: string, port: number, originalError?: string) {
    super(
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'El servicio de almacenamiento de archivos no está disponible',
        details: `No se pudo conectar a MinIO en ${endpoint}:${port}. Verifica que el servicio esté corriendo.`,
        error: 'Service Unavailable',
        originalError,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

/**
 * Excepción para errores al subir archivos a MinIO
 */
export class MinioUploadException extends HttpException {
  constructor(bucket: string, objectName: string, originalError?: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al subir el archivo',
        details: `No se pudo subir el archivo a ${bucket}/${objectName}`,
        error: 'Internal Server Error',
        originalError,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * Excepción para cuando un archivo no se encuentra en MinIO
 */
export class MinioNotFoundException extends HttpException {
  constructor(bucket: string, objectName: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Archivo no encontrado',
        details: `El archivo ${bucket}/${objectName} no existe en el almacenamiento`,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Excepción para errores al eliminar archivos de MinIO
 */
export class MinioDeleteException extends HttpException {
  constructor(bucket: string, objectName: string, originalError?: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al eliminar el archivo',
        details: `No se pudo eliminar el archivo ${bucket}/${objectName}`,
        error: 'Internal Server Error',
        originalError,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * Excepción para URLs de archivos inválidas
 */
export class MinioInvalidUrlException extends HttpException {
  constructor(url: string, expectedFormat?: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'URL de archivo inválida',
        details: `La URL proporcionada no tiene el formato correcto: ${url}`,
        expectedFormat: expectedFormat || '/api/files/{bucket}/{objectName}',
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
