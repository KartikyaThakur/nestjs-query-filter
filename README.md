# dynamic-query-filter

[![npm version](https://badge.fury.io/js/%40nestjs-query%2Ffilter.svg)](https://badge.fury.io/js/%40nestjs-query%2Ffilter)
[![Build Status](https://travis-ci.com/doug-martin/nestjs-query.svg?branch=master)](https://travis-ci.com/doug-martin/nestjs-query)
[![Coverage Status](https://coveralls.io/repos/github/doug-martin/nestjs-query/badge.svg?branch=master)](https://coveralls.io/github/doug-martin/nestjs-query?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Your savior from the trivial yet time consuming task of facilitating filteration on RESTful APIs.
This package that provides a common interface for filtering data and currently supports:
- [Mongoose](https://mongoosejs.com/)
- [TypeORM](https://typeorm.io/#/)
- [Sequelize](https://sequelize.org/)
- [Knex](http://knexjs.org/)
- [In Memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)


## Installation

```bash
npm install --save @dynamic-query-filter
```

## @ORMFilters

Let's look at a simple example, given we want to filter users by name, for the following requestUrl

```
/users?filter.name=string.eq.Ezio%20Auditore
```

The resulting filter will be

```json
{ "name": { "$eq": "Ezio Auditore" }}
```

A more complex example, given we want to filter users by name and age, for the following requestUrl

```
/users?filter.name=string.eq.Ezio%20Auditore&filter.age=number.gte.21&filter.age=number.lt.30
```

The resulting filter will be

```json
{
  "name": { "$eq": "Ezio Auditore" },
  "age": { "$gte": 21, "$lt": 30 }
}
```

### Usage

```typescript
import { FilterRequests, FilterRequest } from 'dynamic-query-filter';

@Get('/users')
async findAll(@ORMFilters() filterRequest: ORMFilter) {
  // You can use the filterRequest to filter your data, directly passing it to mongoose
  // For example:
  const users = await this.userService.findAll(filterRequest);
  return users;
}
```

## @ArrayFilters

There are cases where the processed data needs to be filtered in memory
Unlike the @ORMFilters decorator, the @ArrayFilters decorator will return a function that can serve as predicate for the filter.

Let's look at a simple example, given we want to filter users by name, for the following requestUrl

```
/users/profile?filter.name=string.eq.Ezio%20Auditore
```

The resulting predicate will be

```typescript
(user: User) => user.name === 'Ezio Auditore'
```

A more complex example, given we want to filter users by name and age, for the following requestUrl

```
/users/profile?filter.name=string.eq.Ezio%20Auditore&filter.age=number.gte.21&filter.age=number.lt.30
```

The resulting predicate will be

```typescript
(user: User) => user.name === 'Ezio Auditore' && user.age >= 21 && user.age < 30
```

### Usage

```typescript
import { FilterRequests, FilterRequest } from 'dynamic-query-filter';

@Get('/users/comparison')
async findAll(@ArrayFilters() filterRequest: ArrayFilter) {
  // The array can be hard coded or fetched from a database
  const users = await this.userService.findAll();
  // ...
  // [Any business logic that is needed to be applied before filtering]
  // ...
  // Now you can the filterRequest to filter the data in memory
  return users.filter(filterRequest);
}
```
