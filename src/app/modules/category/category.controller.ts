import { Request, Response } from "express";

import httpStatus from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";

import { CategoryService } from "./category.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, {

    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result,

    });


});

const getAll = catchAsync(async (_req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();

  sendResponse(res, {

    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result.categories,

    meta: { total: result.total },
  }
    );
});

const getById = catchAsync(async (req: Request, res: Response) => {

  const result = await CategoryService.getCategoryById(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,

    message: "Category retrieved successfully",
    data: result,
  })
});

const update = catchAsync(async (req: Request, res: Response) => {

  const result = await CategoryService.updateCategory(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,

    message: "Category updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.deleteCategory(req.params.id as string);
  sendResponse(res, {

    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: result,
   }
  )
})

export const CategoryController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
