import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userToken: string;

  private apikey = 'AIzaSyC71smkAXqazemnhl9zbP5QgmpLQL-GJZU';
  // crear nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apikey}`,
      authData
    ).pipe(
      map(resp => {
        console.log('entro en mapa de rxjs');
        // tslint:disable-next-line: no-string-literal
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }

  nuevoUsuario(usuario: UsuarioModel) {
    // const authData = {
    //   email: usuario.email,
    //   password: usuario.password,
    //   returnSecureToken: true
    // };
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apikey}`,
      authData
    ).pipe(
      map(resp => {
        console.log('entro en mapa de rxjs');
        // tslint:disable-next-line: no-string-literal
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expire', hoy.getTime().toString());

  }

  private leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
  }

  public estaAutenticado(): boolean {

    if (this.userToken.length < 2) {
      return false;
    }
    const expire = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if (expireDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }

}
