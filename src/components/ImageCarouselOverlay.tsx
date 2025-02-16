import React from "react";
import type { UrlObject } from "url";

import { XyzTransition } from "@animxyz/react";
import { CloseIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { css } from "@emotion/react";
import { keyword } from "color-convert";
import Link from "next/link";
import { useRouter } from "next/router";

import styleUtils from "../utils/styleUtils";

import Carousel from "./Carousel";

export const imageCarouselRouting = {
  queryParam: "overlay",
  queryValue: "image-carousel",
  indexQueryParam: "index",
  queryBuilder(selectedIndex: number) {
    return {
      [this.queryParam]: this.queryValue,
      [this.indexQueryParam]: selectedIndex,
    };
  },
};

interface Props {
  images: Array<{ src: string; alt: string }>;
}

const ImageCarouselOverlay = ({ images }: Props) => {
  const router = useRouter();
  const selectedItemMod =
    Number.parseInt(
      router.query[imageCarouselRouting.indexQueryParam] as string
    ) % images.length;
  const selectedItem =
    selectedItemMod < 0
      ? images.length - Math.abs(selectedItemMod)
      : selectedItemMod;
  const open =
    router.query[imageCarouselRouting.queryParam] ===
    imageCarouselRouting.queryValue;
  const routes = {
    close: {
      pathname: router.pathname,
      query: (() => {
        const query = { ...router.query };
        delete query[imageCarouselRouting.indexQueryParam];
        delete query[imageCarouselRouting.queryParam];
        return query;
      })(),
    },
    prev: {
      pathname: router.pathname,
      query: {
        ...router.query,
        [imageCarouselRouting.indexQueryParam]: selectedItem - 1,
      },
    },
    next: {
      pathname: router.pathname,
      query: {
        ...router.query,
        [imageCarouselRouting.indexQueryParam]: selectedItem + 1,
      },
    },
  };

  React.useEffect(() => {
    if (open) {
      const listener = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          router.replace(routes.close, undefined, { scroll: false });
          document.removeEventListener("keydown", listener);
        } else if (event.key === "ArrowRight") {
          router.replace(routes.next, undefined, { scroll: false });
        } else if (event.key === "ArrowLeft") {
          router.replace(routes.prev, undefined, { scroll: false });
        }
      };

      document.addEventListener("keydown", listener);

      return () => document.removeEventListener("keydown", listener);
    }
  });

  return (
    <XyzTransition xyz="fade">
      {open && (
        <div css={styles.root}>
          <div css={styles.closeButton}>
            <ControlButton href={routes.close}>
              <CloseIcon />
            </ControlButton>
          </div>
          <div css={styles.prevButton}>
            <ControlButton href={routes.prev}>
              <ArrowBackIcon />
            </ControlButton>
          </div>
          <div css={styles.nextButton}>
            <ControlButton href={routes.next}>
              <ArrowForwardIcon />
            </ControlButton>
          </div>
          <div css={styles.carouselContainer}>
            <Carousel
              index={selectedItem}
              setIndex={(index) =>
                router.replace(
                  {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      [imageCarouselRouting.indexQueryParam]: index,
                    },
                  },
                  undefined,
                  { scroll: false }
                )
              }
              items={images}
              slideComponent={({
                item: { src, alt },
                isActive,
                isPrev,
                isNext,
              }) => (
                <>
                  {isActive && (
                    <Link href={routes.close} scroll={false} replace passHref>
                      <a tabIndex={-1} css={styles.backgroundCover} />
                    </Link>
                  )}
                  <div key={src} css={styles.carouselFrame}>
                    {(isActive || isPrev || isNext) && (
                      <img src={src} alt={alt} loading="lazy" />
                    )}
                  </div>
                </>
              )}
            />
          </div>
        </div>
      )}
    </XyzTransition>
  );
};

const ControlButton = ({
  href,
  children,
}: {
  href: UrlObject | string;
  children: React.ReactChild;
}) => (
  <Link scroll={false} href={href} replace passHref>
    <a css={styles.controlButton}>{children}</a>
  </Link>
);

const styles = Object.freeze({
  root: css`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 100;
    background: rgba(${keyword.rgb("black").join(",")}, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  backgroundCover: css`
    height: 100vh;
    width: 100vw;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    cursor: auto;
  `,
  closeButton: css`
    position: fixed;
    z-index: 100;
    top: 25px;
    left: 25px;
  `,
  prevButton: css`
    position: fixed;
    z-index: 100;
    left: 25px;
    top: calc(50vh - 25px);
    > a {
      ${styleUtils.mobile(
        css`
          background: var(--transparent-primary);
        `
      )}
    }
  `,
  nextButton: css`
    position: fixed;
    z-index: 100;
    right: 25px;
    top: calc(50vh - 25px);
    > a {
      ${styleUtils.mobile(css`
        background: var(--transparent-primary);
      `)}
    }
  `,
  controlButton: css`
    ${styleUtils.clickableShadow}
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
    border-radius: 25px;
    background: var(--primary-color);
  `,
  carouselContainer: css`
    margin-top: 100px;
    margin-bottom: 100px;
    ${styleUtils.mobile(css`
      margin-top: 0;
      margin-bottom: 0;
    `)}
    max-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    .swiper-initialized {
      width: 100vw;
      height: 100vh;
    }
  `,
  carouselFrame: css`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: auto;
    height: 100vh;
    img {
      height: auto !important;
      width: auto !important;
      max-height: 85%;
      max-width: 100%;
      z-index: 100;
      cursor: grab;
      &:active {
        cursor: grabbing;
      }
    }
  `,
});

export default ImageCarouselOverlay;
