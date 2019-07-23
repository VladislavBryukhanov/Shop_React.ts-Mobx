export interface IUser extends ICredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: boolean | string;
  birthday: number | null;
  contactInfo?: IContactInfo;
  [id: string]: string | boolean | null | number | IContactInfo | undefined;
}

export interface ICredentials {
  email: string;
  password: string;
}

export interface IContactInfo {
  address: string;
  phone: string;
}
