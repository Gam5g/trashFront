import React from "react";
import CommunityDetail from "../../../components/CommunityDetail";
import { NanumPosts } from "./NanumPosts";

const CommunityNanumDetail = () => {
  return <CommunityDetail posts={NanumPosts} postsType="nanum" />;
};

export default CommunityNanumDetail;
