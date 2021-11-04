import { GetStaticProps } from "next";

import type content from "../../public/resources/pages/cake-pricing-flavors/content.json";
import contentClient from "../clients/contentClient";

type Content = typeof content;

const Page = () => <></>;

export const getStaticProps: GetStaticProps = async () => {
  const props = await contentClient.getContentForPage<Content>(
    "cake-pricing-flavors"
  );
  return { props };
};

export default Page;
