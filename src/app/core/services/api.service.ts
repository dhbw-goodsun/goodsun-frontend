import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from "../../../environments/environment";
import { IResults, IUserData } from '../models/UserData';


@Injectable({
  providedIn: 'root'
})

/**
 * Provide ApiService.
 */
export class ApiService {

  constructor(private http: HttpClient) { }
    
  /* Base API-Url. Defined in ./environments/ */
  private readonly baseUrl: string = environment.api.baseUrl;


  /**
   *  General Get-Function
   */
  private doGetRequest<T>(url: string): Promise<T> {
      const request: Observable<T> = this.http.get<T>(`${this.baseUrl}` + url, { responseType: 'json' });
      return firstValueFrom(request);
  }


  /**
   * General Post-Function 
   */
  private doPostRequest<T>(url: string, body: object): Promise<T> {
      const request: Observable<T> = this.http.post<T>(`${this.baseUrl}` + url, body, { responseType: 'json' });
      return firstValueFrom(request);
  }


  /**
   * Sends UserData to backend and returns (awaits) the result.
   * 
   * @param data UserData which is sent.
   */
  async postUserData(data: IUserData): Promise<IResults> {
    return await this.doPostRequest(`/yield`, data)
  }
}
