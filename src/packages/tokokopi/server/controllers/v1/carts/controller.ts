import {
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
} from "@overnightjs/core";
import { Request, Response } from "express";
import * as CatsService from "./service";
import { EResponseCode } from "~/lib/core/constants";
import logger from "~/lib/core/helpers/logger";
import {
  createCartValidator,
  deleteCartItemValidator,
  updateCartItemQtyBodyValidator,
  updateCartItemQtyParamsValidator,
} from "./validator";

import {
  IResBodyCheckout,
  IResBodyCreateCart,
  IResBodyDeleteCartItem,
  IResBodyGetCartItemsByUser,
  IResBodyUpdateCartItemQty,
  TReqBodyCreateCart,
  TReqBodyUpdateCartItemQty,
  TReqParamsDeleteCartItem,
  TReqParamsUpdateCartItemQty,
} from "./type";

@Controller("carts")
class CartsController {
  @Get("")
  protected async getCartItemsByUser(req: Request, res: Response) {
    try {
      const response = await CatsService.getCartItemsByUser({
        userId: 1,
      });

      const { data, error } = response;

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyGetCartItemsByUser>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: getCartItemsByUser: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Post("checkout")
  protected async checkout(req: Request, res: Response) {
    try {
      const response = await CatsService.checkout({
        userId: 1,
      });

      const { error, data } = response;

      if (error === "cart_empty") {
        return res.apiError<any>({
          status: 400,
          message: "Cart is empty",
          code: EResponseCode.CART_EMPTY,
        });
      }

      if (error === "product_not_found") {
        return res.apiError<any>({
          status: 404,
          message: "Product is not found",
          code: EResponseCode.NOT_FOUND,
        });
      }

      if (error === "stock_not_enough") {
        return res.apiError<any>({
          status: 400,
          message: "Product stock is not enough",
          code: EResponseCode.PRODUCT_STOCK_NOT_ENOUGH,
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyCheckout>({
        status: 201,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: checkout: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Post("")
  @Middleware(createCartValidator)
  protected async createCart(
    req: Request<unknown, unknown, TReqBodyCreateCart>,
    res: Response
  ) {
    try {
      const { productId, quantity } = req.body;

      const response = await CatsService.createCart({
        productId: productId,
        userId: 1,
        quantity: quantity,
      });

      const { data, error } = response;

      if (error === "product_not_found") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.NOT_FOUND,
          message: "Product is not found",
        });
      }

      if (error === "stock_not_enough") {
        return res.apiError<EResponseCode>({
          status: 400,
          code: EResponseCode.NOT_FOUND,
          message: "Product stock is not enough",
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyCreateCart>({
        status: 201,
        message: "Success",
        code: EResponseCode.SUBMIT_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: createCart: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Put(":cartItemId")
  @Middleware([
    updateCartItemQtyParamsValidator,
    updateCartItemQtyBodyValidator,
  ])
  protected async updateCartItemQty(
    req: Request<
      TReqParamsUpdateCartItemQty,
      unknown,
      TReqBodyUpdateCartItemQty
    >,
    res: Response
  ) {
    try {
      const { quantity } = req.body;
      const { cartItemId } = req.params;

      const response = await CatsService.updateCartItemQty({
        cartItemId: cartItemId,
        userId: 1,
        quantity: quantity,
      });

      const { data, error } = response;

      if (error === "cart_item_not_found") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.NOT_FOUND,
          message: "Cart item is not found",
        });
      }

      if (error === "stock_not_enough") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.PRODUCT_STOCK_NOT_ENOUGH,
          message: "Product stock is not enough",
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyUpdateCartItemQty>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: updateCartItemQty: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }

  @Delete(":cartItemId")
  @Middleware(deleteCartItemValidator)
  protected async deleteCartItem(
    req: Request<TReqParamsDeleteCartItem>,
    res: Response
  ) {
    try {
      const { cartItemId } = req.params;

      const response = await CatsService.deleteCartItem({
        cart_id: Number(cartItemId) || -1,
        userId: 1,
      });

      const { data, error } = response;

      if (error === "cart_item_not_found") {
        return res.apiError<EResponseCode>({
          status: 404,
          code: EResponseCode.NOT_FOUND,
          message: "Cart item is not found",
        });
      }

      if (error === "general_error" || !data) {
        throw response;
      }

      return res.apiSuccess<IResBodyDeleteCartItem>({
        status: 200,
        message: "Success",
        code: EResponseCode.GET_DATA_SUCCESS,
        data,
      });
    } catch (e) {
      logger.error(e.message || e, "CartsController: deleteCartItem: ");
      return res.apiError<EResponseCode>({
        status: 500,
        code: EResponseCode.GENERAL_ERROR,
        message: "error_internal_server_message",
      });
    }
  }
}

export default CartsController;
