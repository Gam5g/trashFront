import React from "react";
import CommunityDetail from "../../../components/CommunityDetail";
import { BunriPosts } from "./BunriPosts";

const CommunityBunriDetail = () => {
  return <CommunityDetail posts={BunriPosts} postsType="bunri" />;
};

export default CommunityBunriDetail;
