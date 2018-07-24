# erc20 Tomocoin genesis swap

## Requirement
- MongoDB
- NodeJS
- Redis

## Config
```
cp config/default.json config/local.json
```
Update environment in`local.json` file

## Install
```
npm install
sudo npm install -g pm2
```

# Run
```
pm2 start crawl.js --watch
```