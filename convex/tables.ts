import { query } from "./_generated/server";

export const get = query(async ({ db }) => {
  return await db.query("coniferUserTable").collect();
});

// add a new user to the db


// get list of videos from user id
export const listVideos = query(async ({ db }, {user_id}:{user_id: string}) => {
    const videos = await db
    .query("coniferUserTable")
    .filter(q => q.eq(q.field("user_id"), user_id))
    .collect();
    return videos

});

// get chat messages from video id
export const listChat = query(async ({ db }, {video_id}) => {
  
});