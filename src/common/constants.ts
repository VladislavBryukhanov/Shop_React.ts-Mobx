export const AuthState = {
  SignedIn: 'SignedIn',
  SignedOut: 'SignedOut',
};

export const PRODUCTS_ONE_PAGE_LIMIT = 3;
export const CART_ONE_PAGE_LIMIT = 4;
export const ORDER_ONE_PAGE_LIMIT = 10;
export const USERS_ONE_PAGE_LIMIT = 5;

export const FileResources = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024,

  logo: `${process.env.PUBLIC_URL}/logo.svg`,
  // defaultPreview: require('@/assets/img/prod_preview.jpg'),
  // seller: require('@/assets/img/chat/seller.png'),
  // customer: require('@/assets/img/chat/customer.png')
};

export const Roles = {
  USER: 'User',
  ADMIN: 'Admin',
  MANAGER: 'Manager'
};
