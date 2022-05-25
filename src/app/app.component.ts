import { Component } from '@angular/core';
import { loremIpsum } from 'lorem-ipsum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tema-angular';
  posts: any = [];
  originalPosts: any = [];
  authors: any = [];
  comments: any = [];
  imagesUrls: any = [];

  constructor() {
    this.setAuthors();
    this.setPosts();
    this.setComments();
  }

  ngOnInit() {
    setTimeout(() => console.log(this.imagesUrls), 10000);
  }

  setPosts(): void {
    fetch("https://jsonplaceholder.typicode.com/posts").then(response => response.json()).then(posts => posts.forEach(async (post: any) => {
      post.body = this.generateBody(50);
      this.posts.push(post);

      let response = await fetch("https://picsum.photos/1280/720");
      let blob = await response.blob();
      let json = `{ "postId": "${post.id}", "img": "${window.URL.createObjectURL(blob)}" }`;
      this.imagesUrls.push(JSON.parse(json));
    }));

    this.originalPosts = this.posts;
  }

  setAuthors(): void {
    fetch("https://jsonplaceholder.typicode.com/users").then(response => response.json()).then(authors => authors.forEach((author: any) => {
      this.authors.push(author);
    }));
  }

  setComments(): void {
    fetch("https://jsonplaceholder.typicode.com/comments").then(response => response.json()).then(comments => comments.forEach((comment: any) => {
      this.comments.push(comment);
    }));
  }

  getAuthorForPost(post: any): any {
    return this.authors.find((author: any) => author.id === post.userId);
  }

  getCommentsForPost(post: any): any {
    let commetsForPost: any = [];

    this.comments.forEach((comment: any) => {
      if (comment.postId === post.id) {
        commetsForPost.push(comment);
      }
    });
    return commetsForPost;
  }

  getImageForPost(post: any): any {
    let url = this.imagesUrls.find((image: any) => image.postId == post.id).url;

    return url;
  }

  generateBody(number: number): string {
    return loremIpsum({ count: number });
  }

  filterByAuthor(event: any) {
    let authorId = event.target.value;

    if (authorId == "null") {
      this.posts = this.originalPosts;
    }
    else {
      this.posts = [];

      this.originalPosts.forEach((post: any) => {
        if (post.userId == authorId) {
          this.posts.push(post);
        }
      });
    }
  }

}
