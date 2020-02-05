# Peltate

Lists articles from a Rosette server.

## Features

- List articles with latest first
- Detail view of an article
- Some PWA support (manifest, offline, cache)

### Yet to come...

- [ ] List article series
- [ ] List authors
- [ ] List articles in articles series
- [ ] List articles of author

## Development

Start web server with auto compile with `npm start`.

### Configuration

`index.html` defines the variable `window.peltateOptions`. It contains:

- `rosetteServerUrl` - url to Rosette Server
- `showMenu` - shows a menu for the application

## Production

### Build

Follow the following instructions:

1) Make sure your git index is empty (no changed files)
1) Open `package.json` and edit the `replace:*` scripts with your configuration
1) Run `npm run replace:all`
1) Replace the image `/image-templates/peltate-pwa-512.png`
1) Run `npm run generate:images`, it will write the generated images to the `/images` folder
1) Run `npm run build` to generate the application
1) The build production application has been created in `/build/es6-bundled`

### Serve from subpath with Apache

If you want to serve the application from a subpath like `https://mydomain.com/subpath` then
you'll have to add a `.htaccess` file in the folder `subpath` at your server.
Add the following content:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /subpath/

  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
  RewriteCond %{REQUEST_URI} !^/.*\..*$
  RewriteRule ^ /subpath/- [L]

  RewriteCond %{REQUEST_URI} !^/.*\..*$
  RewriteRule ^ /subpath/index.html [L]
</IfModule>
```
