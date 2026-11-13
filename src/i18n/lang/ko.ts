import type { UIStrings } from "../types";

export default {
  nav: { home: "홈", posts: "블로그", tags: "태그", about: "소개", archives: "모아보기", search: "검색" },
  post: {
    publishedAt: "작성일", updatedAt: "수정일", sharePostIntro: "이 글 공유하기:",
    sharePostOn: "{{platform}}에 공유", sharePostViaEmail: "메일로 공유", tagLabel: "태그",
    backToTop: "맨 위로", tableOfContents: "목차", goBack: "뒤로", editPage: "수정",
    previousPost: "이전 글", nextPost: "다음 글",
  },
  pagination: { prev: "이전", next: "다음", page: "페이지" },
  home: { socialLinks: "채널", featured: "추천 글", recentPosts: "최근 글", allPosts: "전체 글 보기" },
  footer: { copyright: "Copyright", allRightsReserved: "All rights reserved." },
  pages: {
    tagTitle: "태그", tagDesc: "이 태그가 붙은 글",
    tagsTitle: "태그", tagsDesc: "글에 쓰인 모든 태그입니다.",
    postsTitle: "블로그", postsDesc: "플레이강릉의 모든 글입니다.",
    archivesTitle: "모아보기", archivesDesc: "날짜별로 모아 본 글입니다.",
    searchTitle: "검색", searchDesc: "찾고 싶은 곳이나 메뉴를 검색해 보세요.",
  },
  a11y: {
    skipToContent: "본문으로 건너뛰기", skipTableOfContents: "목차 건너뛰기", openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기", toggleTheme: "밝게/어둡게 전환", searchPlaceholder: "글 검색...",
    noResults: "검색 결과가 없습니다", goToPreviousPage: "이전 페이지로", goToNextPage: "다음 페이지로",
  },
  notFound: { title: "페이지를 찾을 수 없습니다", message: "주소가 바뀌었거나 없는 페이지입니다", goHome: "홈으로 돌아가기" },
} satisfies UIStrings;
