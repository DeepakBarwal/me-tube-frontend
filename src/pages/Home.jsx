import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchFailure, fetchStart, fetchSuccess } from "../store/videoSlice";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Error = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.video);

  useEffect(() => {
    const fetchVideos = async () => {
      dispatch(fetchStart());
      try {
        const response = await axios.get(`/videos/${type}`);
        setVideos(response.data.data);
        dispatch(fetchSuccess(response.data.data));
      } catch (error) {
        console.error(error);
        dispatch(fetchFailure());
      }
    };
    fetchVideos();
  }, [type, dispatch]);

  return (
    <Container>
      {error ? (
        <Error>
          <h2>You need to be logged in to view this page</h2>
        </Error>
      ) : (
        videos.map((video) => <Card key={video._id} video={video} />)
      )}
    </Container>
  );
};

export default Home;
