const images: Record<string, any> = import.meta.glob("$lib/posts/**/*.{png,jpg}", {
  eager: true,
  query: { format: "webp", h: 1000 },
});
const thumbnails: Record<string, any> = import.meta.glob(
  "$lib/posts/**/*.{png,jpg}",
  { eager: true, query: { format: "webp", w: 400 } }
);

export const image = (slug: string, name: string) => {
  return loadImg(slug, name, images);
};

export const thumbnail = (slug: string, name: string) => {
  return loadImg(slug, name, thumbnails);
};

const loadImg = (
  slug: string,
  name: string,
  repository: Record<string, any>
) => {
  const path = "/src/lib/posts/" + slug + "/" + name;
  const image = repository[path];
  if (!image) {
    throw new Error(`Image ${path} not found`);
  }
  return image.default;
};
