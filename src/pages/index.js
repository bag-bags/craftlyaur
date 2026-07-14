import Head from "next/head";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with R3F
const ShoeGrid = dynamic(() => import("@/components/grid/ShoeGrid"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Moroccan Crafts Finder</title>
        <meta name="description" content="Explore our collection of handmade Moroccan leather sandals, palm leaf bags, and traditional home decor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ShoeGrid />
    </>
  );
}
