import { Divider } from "components/divider/Divider";
import { Layout } from "components/layout/Layout";
import { Paragraph } from "components/paragraph/Paragraph";
import { PostImages } from "components/post-images/PostImages";
import RouteSchemeContainer from "components/route-scheme/RouteSchemeContainer";
import { PostTemplateProps } from "./PostTemplate.types";
import { FETMap } from "components/fet-map/FETMap";

export const PostTemplate = ({ post, controlDisplayLinks, hasRouteScheme, hdImagesToDisplay }: PostTemplateProps) => {
  let orderCounter = 1;

  return (
    <Layout title={post.title}>
      <FETMap post={post} controlDisplayLinks={controlDisplayLinks} />
      {hasRouteScheme && (
        <>
          <Divider title="Route scheme" order={orderCounter++} stickyScrollToElementId="route-scheme" />
          <RouteSchemeContainer id={post.id} />
        </>
      )}
      <Divider title="Trip overview" order={orderCounter++} stickyScrollToElementId="paragraph-overview" />
      <Paragraph id="paragraph-overview" body={post.shortDescription} links={post.links["shortDescription"]} />
      {post.description?.length && (
        <>
          <Divider title="Route description" order={orderCounter++} stickyScrollToElementId="paragraph-description" />
          {post.description?.map(({ title, body, links }, i) => (
            <Paragraph key={i} body={body} title={title} id={`paragraph-description-${i + 1}`} links={links} />
          ))}
        </>
      )}
      <Divider title="Trip conditions" order={orderCounter++} stickyScrollToElementId="paragraph-conditions" />
      <Paragraph body={post.weather} title="Weather" id="paragraph-conditions" />
      <Paragraph body={post.trailCondition} title="Trail" links={post.links["trailCondition"]} />
      <Divider title="Additional information" order={orderCounter++} stickyScrollToElementId="paragraph-other" />
      <Paragraph links={post.links["other"]} title="Tips and author's comments" body={post.other} id="paragraph-other" />
      <Paragraph links={post.links["dangers"]} body={post.dangers} title="Dangers" />
      <Paragraph links={post.links["gear"]} body={post.gear} title="Gear used" />
      <Paragraph links={post.links["transportation"]} body={post.transportation} title="Transportation" />
      <Paragraph links={post.links["accomodation"]} body={post.accomodation} title="Accommodation" id="paragraph-general" />
      <Divider title={`Trip photos ${post.videos?.length ? "and videos" : ""}`} order={orderCounter++} stickyScrollToElementId="post-images" />
      {Boolean(post.images.length || post.videos?.length) && (
        <PostImages hdImagesToDisplay={hdImagesToDisplay} videos={post.videos} images={post.images} id={post.id} />
      )}
    </Layout>
  );
};
