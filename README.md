#  BookApp

BookApp is a scalable online book management system built with **React** and **Django**, supporting user registration, book browsing by genre, mutlitple reading list and secure JWT-based authentication.

---

##  Features

###  For Users
- Register and login using JWT authentication
- Browse books by genre or author
- View personal profile and update profile
- See registered books
- Create and manage multiple reading lists
- Add or remove books from reading lists


---

##  Tech Stack

### Frontend
- React
- Redux Toolkit
- Axios

### Backend
- Django
- Django REST Framework
- JWT Authentication

### Media Handling
- Book images stored and served via Django

### Database
- PostgreSQL

### Deployment
- **Backend**: AWS EC2 + NGINX + Gunicorn + Certbot (HTTPS)
- **Frontend**: Vercel
- **Domain**: `https://bookapp.solutions`

---

##  Deployment Details

- **Gunicorn socket** for Django WSGI app
- **NGINX** reverse proxy to handle requests
- **SSL certificate** via Certbot (Let's Encrypt)
- React frontend calls the Django backend at `https://bookapp.solutions/api/`

---

## JWT Authentication

- User receives `access` and `refresh` tokens on login
- Tokens stored in localStorage
- Axios interceptors handle automatic refresh

---

# Author
- Developed by Raijo Raj
- Thrissur, India

