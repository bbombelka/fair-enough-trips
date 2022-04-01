import { Header, PostLayout, Map } from "components";
import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";
import { Post } from "components/post-card-list/PostCardList.types";
import { PostImages } from "components/post-images/PostImages";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

type PostPageProps = {
  post: FullPost;
};

export type PostLink = {
  title: string;
  href: string;
};

export type PostImage = {
  desc: string;
  filename: string;
  isVertical: boolean;
};

export type FullPost = {
  id: string;
  title: string;
  subTitle: string;
  category: string;
  attractiveness: number;
  condition: number;
  difficulty: string;
  terrain: string;
  date: DateClass;
  weather: string;
  trailCondition: string;
  stats: Stats;
  dangers: string;
  accomodation: string;
  transportation: string;
  gear: string;
  other: string;
  shortDescription: string;
  wikilocUrl: string;
  imageUrl: string;
  startingPoint: string;
  endingPoint: string;
  links: Record<
    | "accomodation"
    | "transportation"
    | "other"
    | "dangers"
    | "weather"
    | "gear",
    PostLink[]
  >;
  images: PostImage[];
};

export type DateClass = {
  season: number;
  period: number;
  month: number;
  year: number;
};

export type Stats = {
  duration: number;
  up: number;
  down: number;
  distance: number;
  highestPoint: number;
};

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  return (
    <div>
      <Header />
      <PostLayout>
        <h1>{post.title}</h1>
        <Map post={post} />
        <Divider />
        <Paragraph body={post.shortDescription} />
        <Divider title="Trip conditions" />
        <Paragraph body={post.weather} title="Weather" />
        <Paragraph body={post.trailCondition} title="Trail" />
        <Divider title="General" />
        <Paragraph
          links={post.links["accomodation"]}
          body={post.accomodation}
          title="Accommodation"
        />
        <Paragraph
          links={post.links["transportation"]}
          body={post.transportation}
          title="Transportation"
        />
        <Divider title="Other" />
        <Paragraph links={post.links["other"]} body={post.other} />
        <Paragraph
          links={post.links["dangers"]}
          body={post.dangers}
          title="Dangers"
        />
        <Paragraph
          links={post.links["gear"]}
          body={post.gear}
          title="Gear used"
        />
        {Boolean(post.images.length) && (
          <PostImages images={post.images} id={post.id} />
        )}
      </PostLayout>
    </div>
  );
};

export default PostPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const httpResponse = await fetch(`${process.env.HOST_URL}/postsList`);
  const posts: Post[] = await httpResponse.json();

  return {
    paths: posts.map(({ id }) => ({ params: { id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
  const httpResponse = await fetch(
    `${process.env.HOST_URL}/posts/${params?.id}`,
  );
  const post: FullPost = await httpResponse.json();

  return {
    props: {
      post,
    },
  };
};
