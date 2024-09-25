## Why Clean Architecture and Zod in Next.js
Although it's generally advised to avoid using tools like Zod directly in the core of the business domain, 
I decided to experiment with this approach. My goal was to simplify the code while making the structure 
easier to understand and learn, especially compared to a classic OOP approach. I chose Zod not only for its 
simplicity but also because it’s a popular library within the Next.js ecosystem, making it easy to integrate 
and familiar for many developers. By using Zod for domain object validation, I find the code more readable and 
accessible, allowing a focus on the essentials without adding unnecessary complexity.

Moreover, for those who are accustomed to using tools like Zod but lack knowledge in classic OOP and DDD, 
this approach allows them to get started more easily by practicing with technologies they already know. 
This experimental approach helps me explore how to modernize and streamline architecture while maintaining clarity in the project. 
I also chose DrizzleORM for database management due to its simplicity and type safety, which aligns well with the principles of 
functional and clean architecture that I'm aiming to apply.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

