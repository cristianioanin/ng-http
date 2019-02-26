import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadInput } from '../common/bad-input';

@Injectable({
	providedIn: 'root'
})
export class PostService {
	private url = 'https://jsonplaceholder.typicode.com/posts';

	constructor(private http: HttpClient) {}

	getPosts() {
		return this.http.get(this.url);
	}

	createPost(post) {
		return this.http.post(this.url, JSON.stringify(post)).pipe(
			map((res) => res),
			catchError((error: HttpErrorResponse) => {
				if (error.status === 400) {
					return throwError(new BadInput(error));
				} else {
					return throwError(new AppError(error));
				}
			})
		);
	}

	updatePost(post) {
		return this.http.patch(`${this.url}/${post.id}`, JSON.stringify({ isRead: true })).pipe(
			map((res) => res),
			catchError((error: HttpErrorResponse) => {
				if (error.status === 400) {
					return throwError(new BadInput(error));
				} else {
					return throwError(new AppError(error));
				}
			})
		);

		// this.http.put(this.url, JSON.stringify(post))
	}

	deletePost(id) {
		return this.http.delete(`${this.url}/error/${id}`).pipe(
			map((res) => res),
			catchError((error: HttpErrorResponse) => {
				if (error.status === 404) {
					return throwError(new NotFoundError());
				} else {
					return throwError(new AppError(error));
				}
			})
		);
	}
}
