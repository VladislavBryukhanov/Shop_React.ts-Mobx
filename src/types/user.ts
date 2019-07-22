export interface IUser extends ICredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: boolean | null;
  birthday: number | null;
  contactInfo: IContactInfo;
}

export interface ICredentials {
  email: string;
  password: string;
}

export interface IContactInfo {
  address: string;
  phone: string;
}
