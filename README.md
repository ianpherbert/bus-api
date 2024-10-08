# Bus-API

This is a Node.js API designed to streamline the retrieval of long-distance bus route information across Europe. Currently, the API integrates data from popular bus services like BlaBlaCar Bus and FlixBus schedule information.

## Features

- **Unified API** to query long-distance bus routes in Europe.
- **Support for multiple providers**: Includes data from BlaBlaCar Bus and FlixBus.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Installation

Clone the repository to your local machine:

```
git clone https://github.com/yourusername/bus-api.git
cd bus-api
```

## Install the necessary dependencies:
```
npm install
```
## Usage
```
npm start
```
## Development

Run tests with:
```
npm test
```
To generate a coverage report:
```
npm run test-coverage
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
License

 - **/stop**
	 - queryString [string] **required*
	 - queryType ["name" | "coordinates"] ****required***
 - **/stop/:stopId**
 - **/route**
	 - date [string (yyyymmdd)]  ***optional*** 
	 - page [number] ***optional***
 - **/route/stop/:stopId**
	 - date [string (yyyymmdd)]  ***optional*** 
 - **/location**
	 - name [string] ***optional***
	 - id [string] ***optional***
	 - postalcode [string] ***optional***
		 - **One query item is required**
 - **/company**
 - **/health**

