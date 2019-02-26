import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
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

	constructor(private service: PostService) {}

	ngOnInit() {
		this.service.getAll().subscribe((posts: Array<any>) => {
			this.posts = posts;
		});
	}

	createPost(input: HTMLInputElement) {
		let post = { title: input.value };
		this.posts.unshift(post);

		input.value = '';

		this.service.create(post).subscribe(
			(newPost) => {
				post['id'] = newPost['id'];
			},
			(error: AppError) => {
				if (error instanceof BadInput) {
					// this.form.setErrors(error.originalError);
					this.posts.splice(0, 1);
					alert('Bad Request: Please check your input');
				} else {
					throw error;
				}
			}
		);
	}

	updatePost(post) {
		this.service.update(post).subscribe((updatedPost) => {
			console.log(updatedPost);
		});
	}

	deletePost(post) {
		let index = this.posts.indexOf(post);
		this.posts.splice(index, 1);

		this.service.delete(post.id).subscribe(null, (error: AppError) => {
			this.posts.splice(index, 0, post);
			if (error instanceof NotFoundError) {
				alert('This post has already been deleted');
			} else {
				throw error;
			}
		});
	}
}
