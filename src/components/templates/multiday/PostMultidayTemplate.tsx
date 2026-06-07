import { Divider } from "components/divider/Divider";
import { Layout } from "components/layout/Layout";
import { Paragraph } from "components/paragraph/Paragraph";
import { PostImages } from "components/post-images/PostImages";
import RouteSchemeContainer from "components/route-scheme/RouteSchemeContainer";

import { FETMap } from "components/fet-map/FETMap";
import { PostCard } from "components/post-card/PostCard";
import { Post } from "types/common.types";
import CardList from "components/card-list/CardList";
import { Breadcrumbs } from "components/breadcrumbs/Breadcrumbs";
import { PostTemplateProps } from "../PostTemplate.types";
import { TripSections } from "components/trip-sections/TripSections";

export const PostMultidayTemplate = ({ post, controlDisplayLinks, hasRouteScheme, posts, subPosts }: PostTemplateProps) => {
  let orderCounter = 1;

  return (
    <Layout title={post.title}>
      <Breadcrumbs category={post.category} postTitle={post.title} />
      {Boolean(subPosts?.length) && (
        <>
          <TripSections subPosts={subPosts!} parentPostId={post.id} />
        </>
      )}
      <FETMap post={post} controlDisplayLinks={controlDisplayLinks} />
      {hasRouteScheme && (
        <>
          <Divider title="Route scheme" order={orderCounter++} stickyScrollToElementId="route-scheme" />
          <RouteSchemeContainer id={post.id} />
        </>
      )}
      <Divider title="Trip overview" order={orderCounter++} stickyScrollToElementId="paragraph-overview" />
      <Paragraph id="paragraph-overview" body={post.shortDescription} links={post.links["shortDescription"]} />
      {Boolean(post.description?.length) && (
        <>
          <Divider title="Route description" order={orderCounter++} stickyScrollToElementId="paragraph-description" />
          {post.description?.map(({ title, body, links, stats }, i) =>
            Boolean(body?.[0] || stats) ? (
              <Paragraph key={i} body={body} title={title} id={`paragraph-description-${i + 1}`} links={links} stats={stats} />
            ) : null,
          )}
        </>
      )}

      {Boolean(post.weather?.[0] || post.trailCondition?.[0]) && (
        <>
          <Divider title="Trip conditions" order={orderCounter++} stickyScrollToElementId="paragraph-conditions" />
          {Boolean(post.weather?.[0]) && <Paragraph body={post.weather} title="Weather" id="paragraph-conditions" links={post.links["weather"]} />}
          {Boolean(post.trailCondition?.[0]) && <Paragraph body={post.trailCondition} title="Trail" links={post.links["trailCondition"]} />}
        </>
      )}
      {Boolean(post.other?.[0] || post.dangers?.[0] || post.gear?.[0] || post.transportation?.[0] || post.accomodation?.[0]) && (
        <>
          <Divider title="Additional information" order={orderCounter++} stickyScrollToElementId="paragraph-other" />
          {Boolean(post.other?.[0]) && <Paragraph links={post.links["other"]} title="Tips and author's comments" body={post.other} id="paragraph-other" />}
          {Boolean(post.dangers?.[0]) && <Paragraph links={post.links["dangers"]} body={post.dangers} title="Dangers" />}
          {Boolean(post.gear?.[0]) && <Paragraph links={post.links["gear"]} body={post.gear} title="Gear used" />}
          {Boolean(post.transportation?.[0]) && <Paragraph links={post.links["transportation"]} body={post.transportation} title="Transportation" />}
          {Boolean(post.accomodation?.[0]) && (
            <Paragraph links={post.links["accomodation"]} body={post.accomodation} title="Accommodation" id="paragraph-general" />
          )}
          {Boolean(post.provisions?.[0]) && (
            <Paragraph links={post.links["provisions"]} body={post.provisions as string[]} title="Provisions" id="paragraph-provisions" />
          )}
        </>
      )}
      <Divider title={`Trip photos ${post.videos?.length ? "and videos" : ""}`} order={orderCounter++} stickyScrollToElementId="post-images" />
      {Boolean(post.images.length || post.videos?.length) && <PostImages videos={post.videos} images={post.images} id={post.id} />}
      {Boolean(posts.length) && (
        <>
          <Divider title="Other trips to check" order={orderCounter++} />
          <CardList>
            {posts.map((post) => (
              <PostCard post={post as unknown as Post} key={post.id} />
            ))}
          </CardList>
        </>
      )}
    </Layout>
  );
};
