import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { SearchFormComponent } from '../search-form/search-form.component';
import { BooklistComponent } from "../booklist/booklist.component";
import { CommonModule } from '@angular/common';
import { AuthContextService } from '../../shared/auth-context.service';
import { MybookService } from '../../services/mybook.service';

@Component({
  selector: 'app-book-shelf',
  standalone: true,
  imports: [SearchFormComponent, BooklistComponent, CommonModule],
  templateUrl: './book-shelf.component.html',
  styleUrl: './book-shelf.component.css'
})
export class BookShelfComponent {
  books: any = [];
  private page: number = 0;
  private size: number = 10;
  isLoading: boolean = false;
  hasMoreBooks: boolean = true;
  isAuthenticated: boolean = false;

  private mybookService = inject(MybookService);
  private authContextService = inject(AuthContextService);

  constructor() { 
    this.authContextService.getAuthenticationStatus().subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  ngOnInit() {
    if(this.isAuthenticated) {
      this.loadMyReadingBooks();
    }
  }

  loadMyReadingBooks() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.mybookService.getMyReadingBooks(this.page, this.size).subscribe({
      next: (response: any) => {
        if (response.content.length > 0) {
          this.books = [...this.books, ...response.content];
        }
        this.hasMoreBooks = !response.last;
      },
      complete: () => {
        this.page++;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load books', error);
        this.isLoading = false;
      },
    });
  }
}
