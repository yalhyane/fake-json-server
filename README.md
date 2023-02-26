# Falso-server - NestJS Web Application
This is a web application built using NestJS framework for generating fake data using the great falso library.

> ⚠️ This is just a toy project I created to learn Nestjs

## Features
 ✅&nbsp;Generate fake data for various categories such as name, address, phone number, etc.

 ✅&nbsp;Option to select the number of data items to generate.

 ✅&nbsp;Easy-to-use and intuitive Rest APIs.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js
- NestJS
- MongoDB

### Installation on local machine

1. Clone the repository:

2. Install the dependencies:

```bash
yarn install
```

3. Create `.env` file with required env variables

```bash
cp .env.example .env
```

### Running the Application
1. Start the development server:
```bash
yarn start:dev 
```
2. Visit API documentation at http://localhost:3000/swagger to use the API.
Built With
NestJS - The progressive Node.js framework
Faker.js - A library for generating fake data

## Installation using docker-composer
1. Clone the repository

2. Create `.env` file with required env variables
```bash
cp .env.docker .env
```

3. Start docker-compose
```bash
 docker-compose up -d --build
```

4. Visit API documentation at http://localhost:3000/openapi to use the API.


## Examples of Usage:
### List of available types (falso types):
```bash
curl --location --request GET 'http://localhost:3000/types' 
```
Response: 
```json5
{
  "public": [
    {
      "name": "abbreviation",
      "properties": {}
    },
    {
      "name": "abn",
      "properties": {
        "onlyValid": "boolean"
      }
    },
    // ... other types
    {
      "name": "zip_code",
      "properties": {}
    }
  ]
}
```
### Generate a user
```bash
curl --request GET 'http://localhost:3000/g/user'
```
Response: 
```json
{
    "id": "b5f994e4-67ae-4630-834b-c6a8a3bcd21c",
    "email": "mardkhayprins678@comcast.org",
    "firstName": "Mardkhay",
    "lastName": "Prins",
    "phone": "+1(664)289 3122",
    "img": "https://i.pravatar.cc/100",
    "username": "Mardkhay_Prins2",
    "address": {
        "street": "1489 Smitham Drive",
        "city": "West Janetborough",
        "zipCode": "37432",
        "county": "Worcestershire",
        "country": "Estonia"
    }
}
```
> ⚠️`user` is a defined type in `falso` library

### Generate a list of users
```bash
curl --request GET 'http://localhost:3000/g/user?size=10'
```
Response:
```json5
[
  {
    "id": "c9d59684-d307-4c72-a442-405d436f79d9",
    "email": "nonhlanhla.brouwer@googlemail.com",
    "firstName": "Nonhlanhla",
    "lastName": "Brouwer",
    "phone": "+685 63 8765",
    "img": "https://i.pravatar.cc/100",
    "username": "Nonhlanhla_Brouwer",
    "address": {
      "street": "1441 Lockman Greens",
      "city": "Lawrence",
      "zipCode": "54985-6051",
      "county": "Herefordshire",
      "country": "Lao Peoples Democratic Republic"
    }
  },
  // ... other users
]
```

### Generate a type with properties
```bash
curl --request GET 'http://localhost:3000/g/credit_card_number|brand:Visa?size=10'
```
Response:
```json
[
    "4482 8689 7852 5099",
    "4425 0176 3413 7354",
    "4632 6942 4118 0221",
    "4836 3472 2327 2134",
    "4165 6143 0456 8782",
    "4849 3407 4708 8256",
    "4648 8197 7527 2723",
    "4813 5716 7557 9542",
    "4389 1781 6704 6187",
    "4266 2732 9494 1817"
]
```


## Contributing
Feel free to raise issues or create pull requests to improve the code.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
