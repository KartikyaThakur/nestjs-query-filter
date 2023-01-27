# @kartikyathakur/nestjs-query-filter

[![npm version](https://badge.fury.io/js/@kartikyathakur%2Fnestjs-query-filter.svg)](https://badge.fury.io/js/@kartikyathakur%2Fnestjs-query-filter)
[![License: MIT](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

Your savior from the trivial yet time consuming task of facilitating filteration on NestJS RESTful APIs.
This package provides decorators for NestJS to easily filter data thorugh query parameters and currently supports:
- [Mongoose](https://mongoosejs.com/)
- [TypeORM](https://typeorm.io/#/)
- [Sequelize](https://sequelize.org/)
- [Knex](http://knexjs.org/)
- [In Memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

## Table of Contents

- [Installation](#installation)
- [How to construct a filter](#how-to-construct-a-filter)
  - [Fields](#field)
  - [Type](#type)
  - [Operators](#operator)
  - [Value](#value)
- [@GenerateORMFilter](#generateormfilter)
  - [Sample Usage](#sample-usage)
- [@GenerateArrayFilter](#generatearrayfilter)
  - [Sample Usage](#sample-usage-1)

## Installation

```bash
npm install --save @kartikyathakur/nestjs-query-filter
```

## How to construct a filter

The idea is to have a standard way of filtering data in RESTful APIs, the convention is as follows:

```
/[route]?filter.[field].[type].[operator].[value]
```

### field

This is the field that you want to filter on, for example `name`, `age`, `email`, etc.

### type

This is the type of the field, currently supported types are:

| Type | Description |
|------|-------------|
| string | String |
| number | Number |
| boolean | Boolean |
| date | Date |

### operator

The following operators are supported for comparison:

| Operator | Description | String | Number | Boolean | Date |
|----------|-------------|--------|--------|---------|------|
| eq | Equal | ✅ | ✅ | ✅ | ✅ |
| ne | Not equal | ✅ | ✅ | ✅ | ✅ |
| gt | Greater than | ⛌ | ✅ | ⛌ | ✅ |
| gte | Greater than or equal | ⛌ | ✅ | ⛌ | ✅ |
| lt | Less than | ⛌ | ✅ | ⛌ | ✅ |
| lte | Less than or equal | ⛌ | ✅ | ⛌ | ✅ |
| in | In | ✅ | ✅ | ⛌ | ✅ |
| nin | Not in | ✅ | ✅ | ⛌ | ✅ |
| regex | Regular expression | ✅ | ⛌ | ⛌ | ⛌ |

### value

The value is the value that you want to compare the field against.

## @GenerateORMFilter

Let's look at a simple example, given we want to get all users with the name `Ezio Auditore` we will need to specify this requestUrl:

```
/users?filter.name=string.eq.Ezio%20Auditore
```

The resulting filter will be

```json
{ "name": { "$eq": "Ezio Auditore" }}
```

For a more complex example, let’s say we only want to get users with the name like `Connor` and age between 21 and 30, our requestUrl will be:

```
/users?filter.name=string.regex.Connor&filter.age=number.gte.21
 &filter.age=number.lt.30
```

The resulting filter will be

```json
{
  "name": { "$regex": "Connor" },
  "age": { "$gte": 21, "$lt": 30 }
}
```

Nested objects are also supported, let's say we want to get all users for games that were released after 2012, our requestUrl will be:

```
/users?filter.game.year=date.gte.2012
```

The resulting filter will be

```json
{
  "game.year": { "$gte": "2012" }
}
```

### Sample Usage

Add the decorator `@GenerateORMFilter` to the controller on which you want to apply the filters.
Then make use of the `ORMFilter` by simply passing them to your ORM.

```typescript
import { GenerateORMFilter, ORMFilter } from '@kartikyathakur/nestjs-query-filter';

@Get('/users')
async findAll(@GenerateORMFilter() ormFilter: ORMFilter) {
  // You can use the ormFilter to filter your data, directly passing it to Mongoose/TypeORM/Sequelize/Knex
  // For example:
  const users = await this.userService.findAll(ormFilter);
  return users;
}
```

## @GenerateArrayFilter

There are cases where the processed data needs to be filtered in memory
Unlike the @GenerateORMFilter decorator, the @GenerateArrayFilter decorator will return a function that can serve as predicate for the filter.

Let's look at a simple example, given we want to get all users with the name `Ezio Auditore` we will need to specify this requestUrl:

```
/users/profile?filter.name=string.eq.Ezio%20Auditore
```

The resulting predicate will be

```typescript
(user: User) => user.name === 'Ezio Auditore'
```

For a more complex example, let’s say we only want to get users with the name like `Connor` and age between 21 and 30, our requestUrl will be:

```
/users?filter.name=string.regex.Connor&filter.age=number.gte.21
 &filter.age=number.lt.30
```

The resulting predicate will be

```typescript
(user: User) => new RegExp('Connor').test(user.name) && user.age >= 21 && user.age < 30
```

Nested objects are also supported, let's say we want to get all users for games that were released after 2012, our requestUrl will be:

```
/users?filter.game.year=date.gte.2012
```

The resulting predicate will be

```typescript
(user: User) => user.game.year >= 2012
```


### Sample Usage

Add the decorator `@GenerateArrayFilter` to the controller on which you want to apply the filters.
Then make use of the `ArrayFilter` as the filter predicate for the array.

```typescript
import { GenerateArrayFilter, ArrayFilter } from '@kartikyathakur/nestjs-query-filter';

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