# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-12-01

### Added

- product_categories table
- recreated products table
- recreated orders table
- product_options table
- products table now supports 4 image urls

## [Unreleased] - 2025-11-28

### Added

- can create order returns
- can filter order returns by status
- can search order returns
- can import and export order returns
- can update and delete order returns

## [Unreleased] - 2025-11-23

### Added

- added 'Returns' for refund processing
- api and web route for 'Returns'
- migration for 'Returns'
- index, edit (view), and create pages for 'Returns' (partially done)

## [Unreleased] - 2025-11-21

### Added

- findOrFail on Customer and Order when sending an internal note mail

## [Unreleased] - 2025-11-17

### Added

- When note is set to 'email', send mail with customer with order update

## [Unreleased] - 2025-11-15

### Added

- Added internal notes, create, can pin note, note type

## [Unreleased] - 2025-11-02

### Added

- Customer profile
- View 10 recent orders from a customer in customer profile screen

## [Unreleased] - 2025-10-12

### Added

- Create order works with the added parameters
- added a quantity counter with a min 1 and max 10 when creating an order
- fetch products pagination
- search and select product when creating an order
- clicking the app icon takes user to home (dashboard)

## [Unreleased] - 2025-10-08

### Added

- Droptheship as the name of the app instead of the default

## [Unreleased] - 2025-10-07

### Added

- can search customers, customer profile view still blank

## [Unreleased] - 2025-09-18

### Removed

- Exporting orders without filtering (unnecessary)

### Added

- Exporting orders to excel format with filtering

## [Unreleased] - 2025-09-14

### Added

- Order list with filters (status)

## [Unreleased] - 2025-09-13

### Added

- can add and delete orders

## [Unreleased] - 2025-09-10

### Added

- added a product id fk in orders
- added address, postal_code, state in orders
- get order with the customer and product
- view single order page (still empty)

## [Unreleased] - 2025-09-02

### Added

- customer controller
- import orders via csv
- customer model
- customer factory that generates fake data for testing
- orders table now links to customers.id instead of users.id
- add order form
- all possible currencies json file
- customer search api route
- orders create web route

### Removed

- add order dialog

## [Unreleased] - 2025-08-28

### Added

- can add product via import, handles validation as well
- add product button now has tabs, tab 1 - adding via form and tab 2 - adding via import

## [Unreleased] - 2025-08-27

### Added

- add product with validation
- delete product
- update product with validation

### Changed

- Add product page to just a modal with a multistep form

### Removed

- The create product page
