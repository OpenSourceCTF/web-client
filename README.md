<img src="https://media.giphy.com/media/144FER6Sz95uZW/giphy.gif">

# CTF Pro web client

The web client for CTF Pro, consumable as a JS module.

You will probably need the `website` project up and running to be able to utilise this client. Not only is it integrated there as a module, but that repo also hosts the image assets required.

Browser support is the last 2 versions of modern browsers only (Chrome, Firefox, Edge, Safari). This is reflected in the Babel config.

# Prerequisites

- Node >= 6.x
- npm >= 5.x

## Quick Guide

Copy `.env.example` to `.env` and edit as desired.

The dev task can be run with `npm run dev`. This will watch the project files and automatically rebundle whenever there's a change.

The build task can be run with `npm run build`.

You can run `npm run stats` to generate statistics regarding the build.
