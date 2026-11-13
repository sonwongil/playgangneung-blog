import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://playgangneung.com/",
    title: "플레이강릉",
    description: "강릉의 맛집, 숙소, 가볼 만한 곳을 영상과 글로 소개합니다.",
    author: "플레이강릉",
    profile: "https://www.youtube.com/@playgangneung",
    ogImage: "default-og.jpg",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: {
    perPage: 8,
    perIndex: 6,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "youtube", url: "https://www.youtube.com/@playgangneung" },
    { name: "facebook", url: "https://www.facebook.com/profile.php?id=61589314617028" },
  ],
  shareLinks: [
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=%ED%94%8C%EB%A0%88%EC%9D%B4%EA%B0%95%EB%A6%89&body=" },
  ],
});
