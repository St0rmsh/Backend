# Fix Bookmarks, Likes & Comments — Full Stack

The feed page (`/feed`) has placeholder buttons for like, comment, and bookmark that show toast messages ("placeholder for this phase") instead of calling the real APIs. The bookmarks page shows "No bookmarks" because the frontend expects a different response shape than the backend returns. This plan wires up all the real functionality.

## Issues Identified

### 1. FeedCard — Like, Comment, Bookmark Buttons Are Placeholders
In [FeedCard.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/feed/components/FeedCard.tsx#L160-L200):
- **Like button** (line 162–171): Shows `toast.info("Likes system is a placeholder")` instead of calling the like API
- **Comment button** (line 174–183): Shows `toast.info("Comments system is a placeholder")` instead of navigating to the post's comments
- **Bookmark button** (line 191–199): Shows `toast.info("Bookmarks system is a placeholder")` instead of calling the bookmark toggle API

**Fix**: Replace placeholder buttons with the real `LikeButton`, `BookmarkButton` components (already exist), and wire comment button to navigate to the post detail page's `#comments` section.

### 2. Bookmarks Page — Response Shape Mismatch
The [bookmarkSlice.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/bookmarks/state/bookmarkSlice.ts#L95-L113) expects:
```
data.pagination.currentPage
data.pagination.totalPages  
data.pagination.totalBookmarks
data.pagination.hasNextPage
data.pagination.hasPrevPage
```

But the backend [bookmark.controller.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/controller/bookmark.controller.ts#L62-L65) spreads the service result directly:
```
data.currentPage
data.totalPages
data.totalBookmarks
data.hasNextPage
data.hasPrevPage
```

**Fix**: Update the frontend `bookmarkSlice` fulfilled handler to match the flat response from the backend (no `pagination` nesting).

### 3. BookmarksPage — Missing Fields in Post Populate
The backend [bookmark.service.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/services/bookmark.service.ts#L73-L74) only selects:
```
"title content coverImage category likesCount commentsCount createdAt"
```

Missing: `tags`, `viewsCount`, `updatedAt`, `isPublished` — needed by the `FeedCard` component to render tags, view count, and elapsed time.

**Fix**: Add missing fields to the populate `select`.

### 4. FeedCard Like Count — Not Updating After Toggle
The `FeedCard` currently shows `post.likesCount` as a static number. When a user likes/unlikes via the `LikeButton`, the `likesCount` on the feed post doesn't update because the feed slice's `posts` array is not updated.

**Fix**: Add a reducer to the `feedSlice` to update `likesCount` optimistically, and dispatch it from the `FeedCard`'s like interaction. The `LikeButton` component already handles optimistic UI for its own count display.

### 5. Bookmark Toggle Not Updating `bookmarkedPosts` List on Response
The `toggleBookmarkThunk.fulfilled` handler doesn't update the `bookmarkedPosts` list based on the API response. This causes bookmark state to be lost on page navigation.

**Fix**: Update `toggleBookmarkThunk.fulfilled` to add/remove from `bookmarkedPosts` based on the backend response (checking `bookmark.bookmarked` field).

## Proposed Changes

### Frontend — Feed Feature

#### [MODIFY] [FeedCard.tsx](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/feed/components/FeedCard.tsx)
- Replace placeholder like button with real `LikeButton` component
- Replace placeholder bookmark button with real `BookmarkButton` component  
- Wire comment button to navigate to `posts/:id#comments`
- Add `updatePostLikesCount` and `updatePostCommentsCount` dispatches for optimistic UI

#### [MODIFY] [feedSlice.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/feed/state/feedSlice.ts)
- Add `updatePostLikesCount` reducer to update a specific post's `likesCount` in the feed
- Add `updatePostCommentsCount` reducer to update a specific post's `commentsCount` in the feed

---

### Frontend — Bookmarks Feature

#### [MODIFY] [bookmarkSlice.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Frontend/src/features/bookmarks/state/bookmarkSlice.ts)
- Fix `fetchMyBookmarksThunk.fulfilled` to read from flat response (`data.currentPage` instead of `data.pagination.currentPage`)
- Update `toggleBookmarkThunk.fulfilled` to properly sync `bookmarkedPosts` list based on API response

---

### Backend — Bookmark Service

#### [MODIFY] [bookmark.service.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/services/bookmark.service.ts)
- Add missing fields to post populate: `tags`, `viewsCount`, `updatedAt`

---

### Backend — Bookmark Controller

#### [MODIFY] [bookmark.controller.ts](file:///c:/Users/User/OneDrive/Desktop/index/Cohort/Backend/Backend/Zentro-TS/Backend/src/controller/bookmark.controller.ts)
- Update `bookmarkController` response to include `message` field for frontend compatibility (currently only returns `{ success, bookmark }` which doesn't have `message`)

## Verification Plan

### Manual Verification
1. Navigate to `http://localhost:5173/feed`
2. Click the heart/like button on a post → should toggle like state, count should update
3. Click the comment button on a post → should navigate to post detail page at `#comments`
4. Click the bookmark button on a post → should toggle bookmark state
5. Click "Bookmarks" in sidebar → should navigate to `/bookmarks` and show bookmarked posts
6. Verify like/comment counts are correct and match between feed and post detail page
