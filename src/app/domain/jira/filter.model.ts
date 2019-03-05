import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface FilterModel {
  self: string;
  id: string;
  name: string;
  owner: {
    self: string,
    key: string,
    name: string,
    avatarUrls: any,
    displayName: string,
    active: boolean
  };
  jql: string;
  viewUrl: string;
  searchUrl: string;
  favourite: boolean;
  sharePermissions: any[];
  sharedUsers: any;
  subscriptions: any;
}
