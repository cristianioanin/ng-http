import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
		return this.http.post(this.url, JSON.stringify(post));
	}

	updatePost(post) {
		return this.http.patch(`${this.url}/${post.id}`, JSON.stringify({ isRead: true }));

		// this.http.put(this.url, JSON.stringify(post))
	}

	deletePost(id) {
		return this.http.delete(`${this.url}/${id}`);
	}
}
