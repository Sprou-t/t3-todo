// initialise trpc in frontend
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../server/router';

const getBaseUrl = () => {
    if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}`;
    if (process.env.RENDER_INTERNAL_HOSTNAME)
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
};

// function integrate tRPC with a Next.js application. This function simplifies the
//  process of setting
// up a tRPC client for use in both client-side and server-side rendering (SSR) contexts.
const trpc = createTRPCNext<AppRouter>({
    // config customises behavior of trpc client, such as setting up links and header
    // specify the properties of opts
    config() {
        return {
            links: [
                httpBatchLink({
                    /**
                     * If you want to use SSR, you need to use the server's full URL
                     * @see https://trpc.io/docs/v11/ssr
                     **/
                    url: `${getBaseUrl()}/api/trpc`,
                    // You can pass any HTTP headers you wish here
                    async headers() {
                        return {
                            // authorization: getAuthCookie(),
                        };
                    },
                }),
            ],
        };
    },
    /**
     * @see https://trpc.io/docs/v11/ssr
     **/
    ssr: false,
});

export { trpc };