# 🔗 URL Shortener with Analytics

A scalable URL shortener service built using Spring Boot and PostgreSQL that converts long URLs into short, shareable links and tracks usage analytics.

---

## 🚀 Features

* 🔗 Shorten long URLs into compact Base62 encoded links
* 🔁 Redirect short URLs to original URLs
* 📊 Track click count analytics for each URL
* 🗄️ Persistent storage using PostgreSQL
* ⚡ RESTful API design using Spring Boot
* 🧠 Efficient encoding using Base62 algorithm

---

## 🛠️ Tech Stack

* **Backend:** Spring Boot (Java)
* **Database:** PostgreSQL
* **ORM:** JPA / Hibernate
* **Build Tool:** Maven
* **API Testing:** Postman

---

## 📌 API Endpoints

### 1️⃣ Create Short URL

```http
POST /api/shorten
```

**Request Body:**

```json
{
  "url": "https://google.com"
}
```

**Response:**

```json
{
  "shortUrl": "http://localhost:8080/b"
}
```

---

### 2️⃣ Redirect to Original URL

```http
GET /{shortCode}
```

**Example:**

```
http://localhost:8080/b
```

👉 Redirects to the original URL

---

### 3️⃣ Get Analytics

```http
GET /api/analytics/{shortCode}
```

**Response:**

```json
{
  "shortCode": "b",
  "longUrl": "https://google.com",
  "clickCount": 5
}
```

---

## 🧠 How It Works

1. Long URL is stored in the database
2. Database generates a unique ID
3. ID is converted to Base62 encoded string
4. Short URL is returned to the user
5. On access:

   * Short code is looked up in DB
   * User is redirected
   * Click count is incremented

---

## 🗂️ Project Structure

```
src/main/java/com/urlshortener
│
├── Controllers
│   ├── UrlController.java
│   └── RedirectController.java
│
├── Entity
│   └── Url.java
│
├── Repository
│   └── UrlRepository.java
│
├── Util
│   └── Base62Encoder.java
│
└── UrlShortenerApplication.java
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener
```

---

### 2️⃣ Configure Database

Create PostgreSQL database:

```sql
CREATE DATABASE url_shortener;
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/url_shortener
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
```

---

### 3️⃣ Run Application

```bash
mvn spring-boot:run
```

---

### 4️⃣ Test APIs

Use Postman or curl to test endpoints.

---

## 📈 Future Enhancements

* 🚀 Redis caching for faster lookups
* 🔐 JWT authentication for user accounts
* 📉 Rate limiting to prevent abuse
* 🐳 Docker containerization
* ☁️ Deployment on Azure / AWS
* 📊 Advanced analytics (time-based, geo tracking)

---

## 🧪 Sample Workflow

1. Create short URL via API
2. Open short link in browser
3. Check analytics endpoint

---

## 💡 Key Concepts Used

* Base62 Encoding
* REST API Design
* JPA & ORM Mapping
* Database-driven unique ID generation
* MVC Architecture

---

## 👨‍💻 Author

**Anush**

---

## ⭐ Acknowledgement

Inspired by real-world URL shortening services like Bitly.

---

## 📜 License

This project is for educational purposes.
