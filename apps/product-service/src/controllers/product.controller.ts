import { NotFoundError, ValidationError } from '@packages/error-handler';
import { imagekit } from '@packages/lib/imageKit';
import prisma from '@packages/lib/prisma';
import { Request, Response, NextFunction } from 'express';

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const config = await prisma.site_config.findFirst();
    if (!config) {
      return res.status(404).json({ error: 'Site configuration not found' });
    }
    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

export const CreateDiscountCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExists = await prisma.discount_codes.findUnique({
      where: {
        discountCode: discountCode,
      },
    });

    if (isDiscountCodeExists) {
      return new ValidationError('Discount code already exists');
    }

    const discountCodeData = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller?.id,
      },
    });

    return res.status(201).json({
      message: 'Discount code created successfully',
      discountCode: discountCodeData,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDiscountCodes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const discountCodes = await prisma.discount_codes.findMany({
      where: { sellerId: req.seller?.id },
    });
    return res.status(200).json({ success: true, discountCodes });
  } catch (error) {
    return next(error);
  }
};

export const deleteDiscountCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id;
    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });
    if (!discountCode) {
      return next(new NotFoundError('Discount code not found'));
    }
    if (discountCode.sellerId !== sellerId) {
      return next(new ValidationError('You are not authorized'));
    }
    await prisma.discount_codes.delete({
      where: { id },
    });
    return res
      .status(200)
      .json({ message: 'Discount code deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileName } = req.body;
    const response = await imagekit.upload({
      file: fileName,
      fileName: `product-${Date.now()}.jpg`,
      folder: '/products',
    });
    return res.status(201).json({
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileId } = req.body;
    const response = await imagekit.deleteFile(fileId);
    return res.status(200).json({
      message: 'Image deleted successfully',
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};
