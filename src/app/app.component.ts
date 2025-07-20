import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',  // This must be INSIDE the @Component decorator
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Your component logic here
  title = 'your-app-name';
}