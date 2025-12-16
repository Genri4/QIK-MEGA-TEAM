import { Union } from '@shared';

export namespace Http {
  export type Code = Union<Code.Enum>;
  export namespace Code {
    export enum Enum {
      // 200
      OK = 'ok',
      // 400
      BAD_REQUEST = 'bad_request',
      // 401
      TOKEN_INVALID = 'token_invalid',
      TOKEN_NOT_PROVIDED = 'token_not_provided',
      WRONG_AUTH_DATA = 'wrong_auth_data',
      // 403
      NOT_ALLOWED = 'not_allowed',
      // 404
      USER_NOT_FOUND = 'user_not_found',
      BUSINESS_NOT_FOUND = 'business_not_found',
      CLIENT_NOT_FOUND = 'client_not_found',
      PAYMENT_PROVIDER_NOT_FOUND = 'payment_provider_not_found',
      BOT_NOT_FOUND = 'bot_not_found',
      PAGE_NOT_FOUND = 'page_not_found',
      BLOCK_NOT_FOUND = 'block_not_found',
      PRODUCT_NOT_FOUND = 'product_not_found',
      CATEGORY_NOT_FOUND = 'category_not_found',
      PARAM_NOT_FOUND = 'param_not_found',
      PARAM_VARIANT_NOT_FOUND = 'param_variant_not_found',
      ORDER_NOT_FOUND = 'order_not_found',
      CART_ITEM_NOT_FOUND = 'cart_item_not_found',
      PRODUCT_FAVORITE_NOT_FOUND = 'product_favorite_not_found',
      // 500
      UNHANDLED_ERROR = 'unhandled_error',
    }
  }
}
