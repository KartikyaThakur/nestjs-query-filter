# dynamic-query-filter

[![npm version](https://badge.fury.io/js/@kartikyathakur%2Fdynamic-query-filter.svg)](https://badge.fury.io/js/@kartikyathakur%2Fdynamic-query-filter)
[![License: MIT](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

Your savior from the trivial yet time consuming task of facilitating filteration on RESTful APIs.
This package that provides a common interface for filtering data and currently supports:
- [Mongoose](https://mongoosejs.com/)
- [TypeORM](https://typeorm.io/#/)
- [Sequelize](https://sequelize.org/)
- [Knex](http://knexjs.org/)
- [In Memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)


## Installation

```bash
npm install --save @kartikyathakur/dynamic-query-filter
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
import { GenerateORMFilter, ORMFilter } from '@kartikyathakur/dynamic-query-filter';

@Get('/users')
async findAll(@GenerateORMFilter() ormFilter: ORMFilter) {
  // You can use the ormFilter to filter your data, directly passing it to mongoose
  // For example:
  const users = await this.userService.findAll(ormFilter);
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
import { GenerateArrayFilter, ArrayFilter } from '@kartikyathakur/dynamic-query-filter';

@Get('/users/comparison')
async findAll(@GenerateArrayFilter() arrayFilter: ArrayFilter) {
  // The array can be hard coded or fetched from a database
  const users = await this.userService.findAll();
  // ...
  // [Any business logic that is needed to be applied before filtering]
  // ...
  // Now you can the arrayFilter to filter the data in memory
  return users.filter(arrayFilter);
}
```
