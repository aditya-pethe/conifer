import { mutation, query } from "./_generated/server";

type User = {
  _id:string,
  user_id:string;
  video_ids: string[];
};


export const get = query(async ({ db }) => {
  return await db.query("coniferUserTable").collect();
});

// add a new user to the db
export const addUser = mutation(async ({ db }, { user_id }:{user_id: string}) => {
  const user = await db.query("coniferUserTable")
    .filter(q => q.eq(q.field("user_id"), user_id)) 
    .collect();
  
  if(user.length <= 0){
    const taskId = await db.insert("coniferUserTable", { user_id:user_id, video_ids:[] });
  }
  // ...
});

// add a video to a users index
export const addVideo = mutation(async ({ db }, { user_id, video_id }:{user_id: string, video_id:string}) => {
    // First, get the user's current list of video ids
    const user = await db.query("coniferUserTable")
    .filter(q => q.eq(q.field("user_id"), user_id))
    .collect();

    const uqUser = user[0];

    if (user) {
      // If the user exists, append the new video id to their list
      const updatedVideoIds = [...uqUser.video_ids, video_id];
  
      // Patch the user's document with the new list of video ids
      await db.patch(uqUser._id, { video_ids: updatedVideoIds });
    } else {
      // If the user doesn't exist, create a new user with the given video id
      await db.insert("coniferUserTable", { user_id, video_ids: [video_id] });
    }
  // ...
});

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