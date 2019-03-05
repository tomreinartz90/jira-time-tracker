import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface AuthorModel {
  self: string;
  name: string;
  displayName: string;
  active: boolean;
}
