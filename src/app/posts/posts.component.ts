import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadInput } from '../common/bad-input';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: [ './posts.component.css' ]
})
export class PostsComponent implements OnInit {
	posts: any[];
	handleUnexpectedError(error: any): void {
		alert('Unexpected error occured');
		console.log(error);
	}

	constructor(private service: PostService) {}

	ngOnInit() {
		this.service.getPosts().subscribe(
			(posts: Array<any>) => {
				this.posts = posts;
			},
			(error) => {
				this.handleUnexpectedError(error);
			}
		);
	}

	createPost(input: HTMLInputElement) {
		let post = { title: input.value };
		input.value = '';

		this.service.createPost(post.title).subscribe(
			(response) => {
				post['id'] = response['id'];
				this.posts.unshift(post);
			},
			(error: AppError) => {
				if (error instanceof BadInput) {
					// this.form.setErrors(error.originalError);
					alert('Bad Request: Please check your input');
				} else {
					this.handleUnexpectedError(error);
				}
			}
		);
	}

	updatePost(post) {
		this.service.updatePost(post).subscribe(
			(response) => {
				console.log(response);
			},
			(error: AppError) => {
				if (error instanceof BadInput) {
					// this.form.setErrors(error.originalError);
					alert('Bad Request: Please check your input');
				} else {
					this.handleUnexpectedError(error);
				}
			}
		);
	}

	deletePost(post) {
		this.service.deletePost(post.id).subscribe(
			(response) => {
				let index = this.posts.indexOf(post);
				this.posts.splice(index, 1);
			},
			(error: AppError) => {
				if (error instanceof NotFoundError) {
					alert('This post has already been deleted');
				} else {
					this.handleUnexpectedError(error);
				}
			}
		);
	}
}
