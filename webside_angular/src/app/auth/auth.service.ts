// auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ApiResponse } from './auth.types';
import { StorageService } from './storage.service';
import { CryptoService } from '../services/crypto.service';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userInfoSubject = new BehaviorSubject<LoginResponse['userInfo'] | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userInfo$ = this.userInfoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService,
    private router: Router,
    private storage: StorageService
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = this.storage.getItem('token');
    const userInfo = this.storage.getItem('userInfo');

    // [修改] 添加更严格的检查
    if (token && userInfo && userInfo !== 'undefined') {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo) {
          this.isAuthenticatedSubject.next(true);
          this.userInfoSubject.next(parsedUserInfo);
        } else {
          this.clearAuthData(); // 数据无效时清除
        }
      } catch (error) {
        console.warn('Invalid userInfo in storage, clearing auth data');
        this.clearAuthData(); // JSON解析失败时清除认证数据
      }
    } else {
      this.clearAuthData(); // 数据不完整时清除认证数据
    }
    
  }

  // 新增注册方法
  register(phone: string, password: string, username: string): Observable<ApiResponse<RegisterResponse>> {
    // 使用与登录相同的加密流程
    const encryptedPassword = this.cryptoService.encryptPassword(password);
    // const timestamp = new Date().getTime();
    
    const registerRequest: RegisterRequest = {
      phone,
      password: encryptedPassword,
      username,
      // timestamp
    };

    console.log('Register request - encrypted password: ', encryptedPassword);
    // console.log('Register timestamp: ', timestamp);
    console.log('Register URL: ', `${this.API_URL}/user/register`);

    return this.http.post<ApiResponse<RegisterResponse>>(`${this.API_URL}/user/register`, registerRequest)
      .pipe(
        tap((response: ApiResponse<RegisterResponse>) => {
          if (response.code === 200 && response.data) {
            // 注册成功后直接登录
            this.storage.setItem('token', response.data.token);
            this.storage.setItem('userInfo', JSON.stringify(response.data.userInfo));
            this.isAuthenticatedSubject.next(true);
            this.userInfoSubject.next(response.data.userInfo);
            this.router.navigate(['/dashboard']);
          }else if (response.code !== 200) {
            // 如果是业务逻辑错误，抛出错误
            console.log('error.....:'+ response.message);
            throw new Error(response.message);
          }
        }),
        catchError((error) => {
          console.error('(auth)Registration failed:', error);
          // 如果是响应体本身就是错误信息
          if (error.error && typeof error.error === 'object') {
            return throwError(() => new Error(error.error.message || '注册失败，请稍后重试'));
          }
          // 如果错误信息在响应体中
          if (error.message) {
            return throwError(() => new Error(error.message));
          }
          return throwError(() => new Error('注册失败，请稍后重试'));
        })
      );
  }

  login(phone: string, password: string): Observable<ApiResponse<LoginResponse>> {
    
    // 在发送前对密码进行加密
    const encryptedPassword = this.cryptoService.encryptPassword(password);
    const timestamp = new Date().getTime();
    const loginRequest: LoginRequest = { phone, password: encryptedPassword, timestamp };

    console.log('encryptedPassword: ', encryptedPassword);
    console.log('timestamp: ', timestamp); 
    console.log('url: ', `${this.API_URL}/user/login`); 
    
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/user/login`, loginRequest)
      .pipe(
        tap((response: ApiResponse<LoginResponse>) => {
          console.log('response: ', response);

          if (response.code === 200 && response.data) {
            this.storage.setItem('token', response.data.token);
            this.storage.setItem('userInfo', JSON.stringify(response.data.userInfo));
            this.isAuthenticatedSubject.next(true);
            this.userInfoSubject.next(response.data.userInfo);
            this.router.navigate(['/dashboard']);
          }else if (response.code !== 200) {
            // 如果是业务逻辑错误，抛出错误
            console.log('error.....:'+ response.message);
            throw new Error(response.message);
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          // 如果是响应体本身就是错误信息
          if (error.error && typeof error.error === 'object') {
            return throwError(() => new Error(error.error.message || '登录失败，请稍后重试'));
          }
          // 如果错误信息在响应体中
          if (error.message) {
            return throwError(() => new Error(error.message));
          }
          return throwError(() => new Error('登录失败，请稍后重试'));
        })
      );
  }

  logout() {
    this.clearAuthData();
  }

  clearAuthData() {
    this.storage.removeItem('token');
    this.storage.removeItem('userInfo');
    this.isAuthenticatedSubject.next(false);
    this.userInfoSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }
}