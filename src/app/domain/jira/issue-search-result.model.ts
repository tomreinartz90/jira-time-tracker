import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IssueI} from './issue.model';

export interface IssueSearchResultModel {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: Array<IssueI>;
}
