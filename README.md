# api-proxy-server

Simple API-proxy server used to forward any request to an API with rate limiting and caching.

This project is based on [this](https://www.youtube.com/watch?v=ZGymN8aFsv4) YouTube tutorial.

### Usage

1. Create a `.env` file based on `.env.template` and fill in all values.

2. Run `npm install` and `npm run dev` to run the proxy server. Per default, it will get hosted on port 5000.

3. Open Postman and send a GET request, e.g. `http://localhost:5000/api?steamid=76561198952409015&include_appinfo=0`
