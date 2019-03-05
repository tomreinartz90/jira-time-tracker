import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthorModel } from "./author.model";

export interface WorkLogModel {
  self?: string;
  author?: AuthorModel;
  updateAuthor?: AuthorModel;
  comment?: string;
  visibility?: { type: string, value: string };
  started?: string;
  timeSpent: string;
  timeSpentSeconds?: number;
  id?: string;
}
