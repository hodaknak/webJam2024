# WebJam 2024

## Purpose
We're hoping to streamline the process of icebreakers for physical and online meetings into a fun, simple app!

## Getting started (development)

First, ensure everything is installed:
```bash
npm install
```

Run the development server for the client side:
```bash
npm run dev
```

On a separate shell, go to the `server` folder and run the server:
```bash
cd server
node server.js
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Pages auto-update as you edit the files.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Usage (for users)

Host: just go to the homepage, click `Create a game`, and give all participants the room code. You will not be able to participate yourself, but you will be able to monitor who has joined.

Participant: just go to the homepage, enter the room code in the box, and click `Join game`.

## Credits
This was created for the ICSSC WebJam 2024 at UCI by Caden Lee, Hodaka Nakamura, Kelvin Wu, and Kyle Kim.

Technologies and tools:
    - [Next.js](https://nextjs.org) (bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app))
    - Tailwind CSS
