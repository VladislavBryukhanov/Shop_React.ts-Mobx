export interface IUser extends ICredentials {
  id?: number;
  firstName: string;
  lastName: string;
  gender?: boolean | string;
  birthday?: number | null;
  ContactInfo?: IContactInfo;
  Role?: IRole;
  createdAt?: string;
  [id: string]: string | boolean | null | number | IContactInfo | undefined | IRole;
}

export interface ICredentials {
  email: string;
  password: string;
}

export interface IContactInfo {
  address: string;
  phone: string;
}

export interface IRole {
  id: number;
  name: string;
}
