import { useState, useEffect } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Comments from "../components/Comments";
import Recommendation from "../components/Recommendation";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  fetchFailure,
  fetchStart,
  fetchSuccess,
  like,
  dislike,
} from "../store/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../store/userSlice";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;

const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.div`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);

  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});

  const fetchLikesAndDislikes = async (videoRes) => {
    const likeUrls = videoRes.likes.map((like) => `/likes/${like}`);
    const dislikeUrls = videoRes.dislikes.map(
      (dislike) => `/dislikes/${dislike}`
    );
    const likeRequests = likeUrls.map((url) => axios.get(url));
    const dislikeRequests = dislikeUrls.map((url) => axios.get(url));
    const resp1 = await axios.all(likeRequests);
    const resp2 = await axios.all(dislikeRequests);
    const likes = resp1.map((res) => res.data.data);
    const dislikes = resp2.map((res) => res.data.data);
    return [likes, dislikes];
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchStart());
      try {
        const videoRes = await axios.get(`/videos/${path}`);
        const channelRes = await axios.get(
          `/users/${videoRes.data.data.userId}`
        );
        const [likes, dislikes] = await fetchLikesAndDislikes(
          videoRes.data.data
        );
        dispatch(fetchSuccess({ ...videoRes.data.data, likes, dislikes }));
        setChannel(channelRes.data.data);
      } catch (error) {
        console.error(error);
        dispatch(fetchFailure());
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    try {
      await axios.post(`/likes/toggle`, null, {
        params: {
          modelId: currentVideo._id,
          modelType: "Video",
        },
      });
      dispatch(like(currentUser._id));

      fetchLikesAndDislikes(currentVideo);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.post(`/dislikes/toggle`, null, {
        params: {
          modelId: currentVideo._id,
          modelType: "Video",
        },
      });
      dispatch(dislike(currentUser._id));
      fetchLikesAndDislikes(currentVideo);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSub = async () => {
    try {
      currentUser.subscribedToUsers.includes(channel._id)
        ? await axios.post(`/users/unsubscribe/${channel._id}`)
        : await axios.post(`/users/subscribe/${channel._id}`);
      dispatch(subscription(channel._id));
    } catch (error) {
      console.error(error);
    }
  };

  console.log("user", currentUser);
  console.log("channel", channel);
  console.log("video", currentVideo);

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo?.videoUrl} controls />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo.views} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser._id) ? (
                <ThumbUpIcon />
              ) : (
                <>
                  <ThumbUpOutlinedIcon />
                </>
              )}{" "}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              {currentVideo.dislikes?.length}
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>
                {channel.subscribers?.length} subscribers
              </ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          {currentUser._id !== currentVideo.userId && (
            <Subscribe onClick={handleSub}>
              {currentUser.subscribedToUsers?.includes(channel._id)
                ? "SUBSCRIBED"
                : "SUBSCRIBE"}
            </Subscribe>
          )}
        </Channel>

        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
  );
};

export default Video;
