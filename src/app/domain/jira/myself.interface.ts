export interface AvatarUrlsI {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

export interface ItemI {
  name: string;
  self: string;
}

export interface GroupsI {
  size: number;
  items: ItemI[];
}

export interface ApplicationRolesI {
  size: number;
  items: any[];
}

export interface MyselfI {
  self: string;
  name: string;
  emailAddress: string;
  avatarUrls: AvatarUrlsI;
  displayName: string;
  active: boolean;
  timeZone: string;
  groups: GroupsI;
  applicationRoles: ApplicationRolesI;
  expand: string;
  key: string;
}


