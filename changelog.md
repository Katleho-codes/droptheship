# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- add product button now has tabs, tab 1 - adding via form and tab 2  - adding via import

## [Unreleased] - 2025-08-27

### Added

- add product with validation
- delete product
- update product with validation

### Changed

- Add product page to just a modal with a multistep form

### Removed

- The create product page