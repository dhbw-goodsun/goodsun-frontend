import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})


export class NavbarComponent {

  isMobileMenuOpen: boolean = false;

  userLoggedIn: boolean = false;
  userFirstName: String = "";


  @HostListener('document:click', ['$event'])
  onClick(e: MouseEvent) {
    let clickedID: String = (e.target as Element).id;

    if (clickedID !== null) {
      if (clickedID == "mobile-menu-switcher") {
        this.switchMobileMenu();
      } else {
        if (this.isMobileMenuOpen) {
          this.switchMobileMenu();
        }
      }
    }
  }

  private switchMobileMenu() {
    if (!this.isMobileMenuOpen) {
      this.isMobileMenuOpen = true;
    } else {
      this.isMobileMenuOpen = false;
  }
  }
}
