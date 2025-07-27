# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## 🐳 Docker Development (Recommended for Windows)

If you're experiencing permission issues on Windows (like the EPERM error), use Docker to run the application in a Linux container:

### Quick Start

```bash
# Using the provided script
./docker-dev.sh

# Or on Windows
docker-dev.bat

# Or manually
docker-compose up --build
```

### Benefits of Docker Development

- ✅ Avoids Windows permission issues
- ✅ Consistent environment across different machines
- ✅ Hot reloading works perfectly
- ✅ No need to install Node.js locally
- ✅ Isolated development environment

### Manual Docker Commands

```bash
# Build the development image
docker build -f Dockerfile.dev -t t3-todo-dev .

# Run the development container
docker run -p 3000:3000 -v $(pwd):/app t3-todo-dev

# For production build
docker build -t t3-todo-prod .
docker run -p 3000:3000 t3-todo-prod
```

The application will be available at http://localhost:3000
