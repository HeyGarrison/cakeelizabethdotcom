import { css } from "@emotion/react";
import { GetStaticProps } from "next";

import MdRenderer from "../components/MdRenderer";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";

const Page = ({ content }: { content: PageContent }) => (
  <div css={styleUtils.pageContainer}>
    <div css={styleUtils.contentContainer}>
      <div css={styles.storyGroup}>
        <div css={styles.text}>
          <MdRenderer input={content.data.owner} />
        </div>
        <div css={styles.image}>
          <img
            alt={content.data.kristinaImgAlt}
            src="/resources/pages/about-us/kristina.jpg"
          />
          <img
            alt={content.data.kristinaEthanImgAlt}
            src="/resources/pages/about-us/kristinaethan.jpg"
          />
        </div>
      </div>
      <div css={styles.storyGroup}>
        <div css={styles.image}>
          <img
            alt={content.data.pattyImgAlt}
            src="/resources/pages/about-us/patty.png"
            loading="lazy"
          />
          <img
            alt={content.data.pattyGordonImgAlt}
            src="/resources/pages/about-us/pattygordon.png"
            loading="lazy"
          />
        </div>
        <div css={styles.text}>
          <MdRenderer input={content.data.founder} />
        </div>
      </div>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "about-us");

  return { props: { content } };
};

const imageAndTextStyles = css`
  display: flex;
  gap: 1em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const styles = Object.freeze({
  storyGroup: css`
    display: flex;
    gap: 1em;
    ${styleUtils.mobile(
      css`
        flex-direction: column;
      `
    )}

    &:last-child {
      margin-top: 2em;
      ${styleUtils.mobile(
        css`
          flex-direction: column-reverse;
        `
      )}
    }
  `,

  text: css`
    width: 60%;
    ${imageAndTextStyles}
    ${styleUtils.mobile(
      css`
        width: 100%;
      `
    )}
  `,
  image: css`
    max-height: 100%;
    width: 40%;
    ${imageAndTextStyles}
    ${styleUtils.mobile(
      css`
        width: 100%;
      `
    )}
    > img {
      border-radius: var(--chakra-radii-md);
      width: 100%;
    }
  `,
});

export default Page;
