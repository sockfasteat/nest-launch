// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import * as jwt from 'jsonwebtoken';
// import { environment } from '../../../environments/environment';
// import UserAPI from '../../datasource/user';
//
// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly userService: UserAPI) {}
//
//   // canActivate(context: ExecutionContext): Observable<boolean> {
//   //   const request: Request = context.switchToHttp().getRequest();
//   //   const userId: number = Number(request.params.userId);
//   //   const loggedInUser: UserEntity = request.user as UserEntity;
//   //
//   //   return this.userService.findUserById(userId).pipe(
//   //     map((user: UserEntity) => ((request as any).requestedUser = user)),
//   //     switchMap((user: UserEntity) => this.userService.canAccessUser(user, loggedInUser))
//   //   );
//   // }
//
//
//
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     if (request) {
//       request.me = await this.validateToken(request.headers.authorization);
//       return true;
//     } else {
//       const ctx: any = GqlExecutionContext.create(context).getContext();
//       ctx.me = await this.validateToken(ctx.headers.authorization);
//       return true;
//     }
//   }
//
//   async validateToken(auth: string) {
//     if (auth.split(' ')[0] !== 'Bearer') {
//       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
//     }
//     const token = auth.split(' ')[1];
//
//     try {
//       const decoded: any = await jwt.verify(token, environment.secret);
//
//       return decoded;
//     } catch (err) {
//       const message = 'Token error: ' + (err.message || err.name);
//       throw new HttpException(message, HttpStatus.UNAUTHORIZED);
//     }
//   }
// }
