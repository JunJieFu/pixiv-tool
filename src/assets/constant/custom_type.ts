export type Result<T> = {
  status: number;
  message: string;
  data: T;
};

export type PixivPicture = {
  pixivId: string;
  pictureId: number;
  name: string;
  pixivUserName: string;
  pixivUserId: string;
  tagList: string;
  state: 'WAIT' | 'SUCCESS' | 'FAIL' | 'ABANDON';
};

export type SaveDto = {
  pixivId: string;
  name: string;
  userName: string;
  userId: string;
  tagString: string;
};

export type Work = {
  illustId: string;
  illustTitle: string;
  id: string;
  title: string;
  illustType: number;
  xRestrict: number;
  restrict: number;
  sl: number;
  url: string;
  description: string;
  tags: string[];
  userId: string;
  userName: string;
  width: number;
  height: number;
  pageCount: number;
  isBookmarkable: boolean;
  isAdContainer: boolean;
  createDate: string;
  updateDate: string;
  profileImageUrl: string;
};

export type PixivCollectBody = {
  works: Work[];
  total: number;
};

export type PixivResult<T> = {
  body: T;
  error: boolean;
  message: string;
};

export interface PixivDetail {
  id: string;
  title: string;
  userName: string;
  userId: string;
  tags: {
    authorId: string;
    isLocked: boolean;
    tags: PixivTagDetail[];
  };
  illustComment: string
  urls: Record<'original', string>
}

export type PixivTagDetail = {
  deletable: boolean;
  locked: boolean;
  tag: string;
  translation: { en: string };
  userId: string;
  userName: string;
};

export interface PixivWork {
  pixivId: string
  description?: string
  originalUrl?: string
  translateTags?: string
}


export interface Page<T> {
  items: T[]
}
